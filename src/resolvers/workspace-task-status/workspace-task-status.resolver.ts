import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateOneWorkspaceTaskStatusArgs,
  User,
  WorkspaceTaskStatus,
} from 'prisma/generated/types';
import { CurrentUser } from 'src/decorators';
import { PrismaService } from 'src/prisma.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Resolver(() => WorkspaceTaskStatus)
export class WorkspaceTaskStatusResolver {
  constructor(
    private readonly prisma: PrismaService,
    private workspaceService: WorkspaceService,
  ) {}

  @Query(() => [WorkspaceTaskStatus], { name: 'workspaceTaskStatuses' })
  async findAll(@CurrentUser() user: User) {
    return this.prisma.workspaceTaskStatus.findMany({
      where: {
        workspaceId: user.currentWorkspaceId,
      },
    });
  }

  @Mutation(() => WorkspaceTaskStatus, { name: 'createWorkspaceTaskStatus' })
  async create(
    @CurrentUser() user: User,
    @Args() createWorkspaceTaskStatusInput: CreateOneWorkspaceTaskStatusArgs,
  ) {
    await this.workspaceService.ensureUserIsWorkspaceOwnerOrAdmin(
      user.currentWorkspaceId,
      user.uuid,
    );

    return this.prisma.workspaceTaskStatus.create(
      createWorkspaceTaskStatusInput,
    );
  }
}

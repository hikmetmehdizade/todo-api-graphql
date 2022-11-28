import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CreateOneWorkspaceTaskStatusArgs,
  Task,
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
      orderBy: {
        order: 'asc',
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

  @ResolveField(() => [Task], { name: 'tasks' })
  tasks(@Parent() workspaceTaskStatus: WorkspaceTaskStatus) {
    return this.prisma.workspaceTaskStatus
      .findUnique({
        where: {
          uuid: workspaceTaskStatus.uuid,
        },
      })
      .tasks();
  }
}

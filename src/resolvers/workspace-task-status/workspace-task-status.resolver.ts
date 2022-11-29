import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Task, User, WorkspaceTaskStatus } from '../../@generated';
import { CurrentUser } from 'src/decorators';
import { PrismaService } from 'src/prisma.service';
import { WorkspaceService } from '../workspace/workspace.service';
import {
  WorkspaceTaskStatusesArgs,
  CreateWorkspaceTaskStatusArgs,
} from './workspace-task-status.args';

@Resolver(() => WorkspaceTaskStatus)
export class WorkspaceTaskStatusResolver {
  constructor(
    private readonly prisma: PrismaService,
    private workspaceService: WorkspaceService,
  ) {}

  @Query(() => [WorkspaceTaskStatus], { name: 'workspaceTaskStatuses' })
  async findAll(
    @CurrentUser() user: User,
    @Args()
    workspaceTaskStatusesInput: WorkspaceTaskStatusesArgs,
  ) {
    return this.prisma.workspaceTaskStatus.findMany({
      ...workspaceTaskStatusesInput,
      where: {
        AND: [
          workspaceTaskStatusesInput.where,
          { workspace: { uuid: user.currentWorkspaceId } },
        ],
      },
    });
  }

  @Mutation(() => WorkspaceTaskStatus, { name: 'createWorkspaceTaskStatus' })
  async create(
    @CurrentUser() user: User,
    @Args()
    createWorkspaceTaskStatusArgs: CreateWorkspaceTaskStatusArgs,
  ) {
    await this.workspaceService.ensureUserIsWorkspaceOwnerOrAdmin(
      user.currentWorkspaceId,
      user.uuid,
    );

    const { data, workspaceWhereUniqueInput } = createWorkspaceTaskStatusArgs;

    return this.prisma.workspaceTaskStatus.create({
      data: {
        ...data,
        workspace: {
          connect: {
            uuid: workspaceWhereUniqueInput?.uuid ?? user.currentWorkspaceId,
          },
        },
      },
      select: { _count: true },
    });
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

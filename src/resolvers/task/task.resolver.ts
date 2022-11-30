import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { CurrentUser, Public, WMRoles } from '../../decorators';
import { PrismaService } from '../../prisma.service';
import { MutationPayload } from '../../types/mutation-payload';
import {
  AssignedMember,
  FindManyTaskArgs,
  FindUniqueTaskArgs,
  Task,
  User,
  Workspace,
  WorkspaceMemberRole,
  WorkspaceTaskStatus,
} from '../../@generated';
import {
  CreateTaskArgs,
  DeleteTaskArgs,
  TaskSubscriptionPayload,
  UpdateTaskArgs,
} from './task.args';
import { TaskService } from './task.service';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB, SubscriptionTriggers } from '../../consts';
import { GenerateSubscriptionPayload } from 'src/utils/subscription';
import { SubscriptionAction } from 'src/types';

@Resolver(() => Task)
export class TaskResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private prisma: PrismaService,
    private taskService: TaskService,
  ) {}

  @Query(() => Task, { name: 'task' })
  task(@Args() taskWhereUniqueInput: FindUniqueTaskArgs) {
    return this.prisma.task.findUnique(taskWhereUniqueInput);
  }

  @Query(() => [Task], { name: 'tasks' })
  tasks(@Args() findTasksWhereUniqueInput: FindManyTaskArgs) {
    return this.prisma.task.findMany(findTasksWhereUniqueInput);
  }

  @WMRoles(
    WorkspaceMemberRole.ADMIN,
    WorkspaceMemberRole.OWNER,
    WorkspaceMemberRole.USER,
  )
  @Mutation(() => MutationPayload, { name: 'createTask' })
  async createTask(
    @CurrentUser() user: User,
    @Args() createTaskArgs: CreateTaskArgs,
  ): Promise<MutationPayload> {
    const { data, members, workspaceWhereUniqueInput } = createTaskArgs;
    const taskStatus = await this.taskService.getFirstTaskStatus(
      workspaceWhereUniqueInput.uuid,
    );
    const assignedMember = members.map(
      ({ role, workspaceMemberWhereUniqueInput }) => ({
        role: role,
        member: { connect: { uuid: workspaceMemberWhereUniqueInput.uuid } },
      }),
    );
    const task = await this.prisma.task.create({
      data: {
        ...data,
        assignedMembers: {
          create: assignedMember,
        },
        workspace: {
          connect: workspaceWhereUniqueInput,
        },
        status: {
          connect: {
            uuid: taskStatus.uuid,
          },
        },
      },
      include: {
        _count: true,
      },
    });

    this.pubSub.publish(SubscriptionTriggers.TASK_SUB, {
      taskSub: new GenerateSubscriptionPayload(task, SubscriptionAction.CREATE),
    });

    return {
      _count: 1,
    };
  }

  @Mutation(() => MutationPayload, { name: 'updateTask' })
  async updateTask(
    @Args() updateTaskArgs: UpdateTaskArgs,
  ): Promise<MutationPayload> {
    const { data, taskWhereUniqueInput } = updateTaskArgs;
    const updatedTask = await this.prisma.task.update({
      where: taskWhereUniqueInput,
      data,
    });
    this.pubSub.publish(SubscriptionTriggers.TASK_SUB, {
      taskSub: new GenerateSubscriptionPayload(
        updatedTask,
        SubscriptionAction.UPDATE,
      ),
    });
    return {
      _count: 1,
    };
  }

  @Mutation(() => MutationPayload, { name: 'deleteTask' })
  async deleteTask(
    @Args() deleteTaskArgs: DeleteTaskArgs,
  ): Promise<MutationPayload> {
    const { taskWhereUniqueInput } = deleteTaskArgs;
    const deletedTask = await this.prisma.task.delete({
      where: taskWhereUniqueInput,
    });

    this.pubSub.publish(SubscriptionTriggers.TASK_SUB, {
      taskSub: new GenerateSubscriptionPayload(
        deletedTask,
        SubscriptionAction.DELETE,
      ),
    });
    return {
      _count: 1,
    };
  }

  @Public()
  @Subscription(() => TaskSubscriptionPayload, {
    filter(payload, variables, context) {
      console.log('payload', payload);
      console.log('var', variables);
      console.log('context', context);

      return true;
    },
  })
  taskSub() {
    return this.pubSub.asyncIterator(SubscriptionTriggers.TASK_SUB);
  }
  @ResolveField(() => Workspace)
  workspace(@Parent() task: Task) {
    return this.prisma.task
      .findUnique({
        where: {
          uuid: task.uuid,
        },
      })
      .workspace();
  }

  @ResolveField(() => [AssignedMember])
  assignedMembers(@Parent() task: Task) {
    return this.prisma.task
      .findUnique({
        where: {
          uuid: task.uuid,
        },
      })
      .assignedMembers();
  }

  @ResolveField(() => WorkspaceTaskStatus)
  status(@Parent() task: Task) {
    return this.prisma.task.findUnique({ where: { uuid: task.uuid } }).status();
  }
}

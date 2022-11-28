import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators';
import { PrismaService } from 'src/prisma.service';
import {
  AssignedMember,
  CreateOneTaskArgs,
  DeleteOneTaskArgs,
  FindManyTaskArgs,
  FindUniqueTaskArgs,
  Task,
  UpdateOneTaskArgs,
  User,
  Workspace,
  WorkspaceTaskStatus,
} from '../../../prisma/generated/types';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(
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
  @Mutation(() => Task, { name: 'createTask' })
  async createTask(
    @CurrentUser() user: User,
    @Args() createTaskInput: CreateOneTaskArgs,
  ) {
    const { currentWorkspaceId } = user;
    const taskStatus = await this.taskService.getFirstTaskStatus(
      currentWorkspaceId,
    );

    return this.prisma.task.create({
      data: {
        ...createTaskInput.data,
        workspace: {
          connect: {
            uuid: currentWorkspaceId,
          },
        },
        status: {
          connect: {
            uuid: taskStatus.uuid,
          },
        },
      },
    });
  }

  @Mutation(() => Task, { name: 'updateTask' })
  updateTask(@Args() updateTaskInput: UpdateOneTaskArgs) {
    return this.prisma.task.update(updateTaskInput);
  }

  @Mutation(() => Task, { name: 'deleteTask' })
  deleteTask(@Args() deleteTaskInput: DeleteOneTaskArgs) {
    return this.prisma.task.delete(deleteTaskInput);
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

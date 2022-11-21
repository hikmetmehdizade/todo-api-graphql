import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import {
  AssignedMember,
  CreateOneTaskArgs,
  DeleteOneTaskArgs,
  FindManyTaskArgs,
  FindUniqueTaskArgs,
  Task,
  UpdateOneTaskArgs,
  Workspace,
  WorkspaceTaskStatus,
} from '../../../prisma/generated/types';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => Task, { name: 'task' })
  task(@Args() taskWhereUniqueInput: FindUniqueTaskArgs) {
    return this.prisma.task.findUnique(taskWhereUniqueInput);
  }

  @Query(() => [Task], { name: 'tasks' })
  tasks(@Args() findTasksWhereUniqueInput: FindManyTaskArgs) {
    return this.prisma.task.findMany(findTasksWhereUniqueInput);
  }
  @Mutation(() => Task, { name: 'createTask' })
  createTask(@Args() createTaskInput: CreateOneTaskArgs) {
    return this.prisma.task.create(createTaskInput);
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

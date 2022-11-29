import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser, WMRoles } from 'src/decorators';
import { PrismaService } from 'src/prisma.service';
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
import { CreateTaskArgs, DeleteTaskArgs, UpdateTaskArgs } from './task.args';
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

  @WMRoles(
    WorkspaceMemberRole.ADMIN,
    WorkspaceMemberRole.OWNER,
    WorkspaceMemberRole.USER,
  )
  @Mutation(() => Task, { name: 'createTask' })
  async createTask(
    @CurrentUser() user: User,
    @Args() createTaskArgs: CreateTaskArgs,
  ) {
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
    return this.prisma.task.create({
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
    });
  }

  @Mutation(() => Task, { name: 'updateTask' })
  updateTask(@Args() updateTaskArgs: UpdateTaskArgs) {
    const { data, taskWhereUniqueInput } = updateTaskArgs;
    return this.prisma.task.update({ where: taskWhereUniqueInput, data });
  }

  @Mutation(() => Task, { name: 'deleteTask' })
  deleteTask(@Args() deleteTaskArgs: DeleteTaskArgs) {
    const { taskWhereUniqueInput } = deleteTaskArgs;
    return this.prisma.task.delete({ where: taskWhereUniqueInput });
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

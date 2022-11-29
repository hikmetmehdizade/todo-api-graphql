import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AssignedMember, Task } from '../../@generated';
import { PrismaService } from 'src/prisma.service';
import {
  CreateAssignedMemberArgs,
  UpdateAssignedMemberArgs,
  DeleteAssignedMemberArgs,
} from './assigned-member.args';

@Resolver(() => AssignedMember)
export class AssignedMemberResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => AssignedMember, { name: 'createAssignedMember' })
  createAssignedMember(
    @Args() createAssignedMemberArgs: CreateAssignedMemberArgs,
  ) {
    const { taskWhereUniqueInput, workspaceMemberWhereUniqueInput, role } =
      createAssignedMemberArgs;
    return this.prisma.assignedMember.create({
      data: {
        role,
        task: {
          connect: taskWhereUniqueInput,
        },
        member: {
          connect: workspaceMemberWhereUniqueInput,
        },
      },
    });
  }

  @Mutation(() => AssignedMember, { name: 'updateAssignedMember' })
  updateAssignedMember(
    @Args() updateAssignedMemberArgs: UpdateAssignedMemberArgs,
  ) {
    const { assignedMemberWhereUniqueInput, role } = updateAssignedMemberArgs;
    return this.prisma.assignedMember.update({
      where: assignedMemberWhereUniqueInput,
      data: { role },
    });
  }

  @Mutation(() => AssignedMember, { name: 'deleteAssignedMember' })
  deleteAssignedMember(
    @Args() deleteAssignedMemberArgs: DeleteAssignedMemberArgs,
  ) {
    const { assignedMemberWhereUniqueInput } = deleteAssignedMemberArgs;
    return this.prisma.assignedMember.delete({
      where: assignedMemberWhereUniqueInput,
    });
  }

  @ResolveField(() => Task)
  task(@Parent() assignedMember: AssignedMember) {
    return this.prisma.assignedMember
      .findUnique({
        where: {
          memberId_taskId: {
            memberId: assignedMember.memberId,
            taskId: assignedMember.taskId,
          },
        },
      })
      .task();
  }
}

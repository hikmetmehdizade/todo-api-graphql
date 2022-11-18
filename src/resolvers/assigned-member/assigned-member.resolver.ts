import {
  Resolver,
  Mutation,
  Query,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import {
  AssignedMember,
  CreateOneAssignedMemberArgs,
  DeleteOneAssignedMemberArgs,
  FindManyAssignedMemberArgs,
  FindUniqueAssignedMemberArgs,
  Task,
  UpdateOneAssignedMemberArgs,
} from 'prisma/generated/types';
import { PrismaService } from 'src/prisma.service';

@Resolver(() => AssignedMember)
export class AssignedMemberResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => AssignedMember, { name: 'assignedMember' })
  assignedMember(
    @Args() assignedMemberWhereUniqueInput: FindUniqueAssignedMemberArgs,
  ) {
    return this.prisma.assignedMember.findUnique(
      assignedMemberWhereUniqueInput,
    );
  }

  @Query(() => [AssignedMember], { name: 'assignedMember' })
  assignedMembers(@Args() assignedMembersInput: FindManyAssignedMemberArgs) {
    return this.prisma.assignedMember.findMany(assignedMembersInput);
  }

  @Mutation(() => AssignedMember, { name: 'createAssignedMember' })
  createAssignedMember(
    @Args() createAssignedMemberInput: CreateOneAssignedMemberArgs,
  ) {
    return this.prisma.assignedMember.create(createAssignedMemberInput);
  }

  @Mutation(() => AssignedMember, { name: 'updateAssignedMember' })
  updateAssignedMember(
    @Args() updateAssignedMemberInput: UpdateOneAssignedMemberArgs,
  ) {
    return this.prisma.assignedMember.update(updateAssignedMemberInput);
  }

  @Mutation(() => AssignedMember, { name: 'deleteAssignedMember' })
  deleteAssignedMember(
    @Args() deleteAssignedMemberInput: DeleteOneAssignedMemberArgs,
  ) {
    return this.prisma.assignedMember.delete(deleteAssignedMemberInput);
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

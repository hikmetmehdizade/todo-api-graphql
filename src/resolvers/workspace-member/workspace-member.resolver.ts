import {
  Resolver,
  Mutation,
  Query,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import {
  FindUniqueWorkspaceMemberArgs,
  WorkspaceMember,
  FindManyWorkspaceMemberArgs,
  CreateOneWorkspaceMemberArgs,
  UpdateOneWorkspaceMemberArgs,
  DeleteOneWorkspaceMemberArgs,
  User,
  Workspace,
} from 'prisma/generated/types';
import { PrismaService } from 'src/prisma.service';

@Resolver(() => WorkspaceMember)
export class WorkspaceMemberResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => WorkspaceMember, { name: 'workspaceMember' })
  workspaceMember(
    @Args() workspaceMemberWhereUniqueInput: FindUniqueWorkspaceMemberArgs,
  ) {
    return this.prisma.workspaceMember.findUnique(
      workspaceMemberWhereUniqueInput,
    );
  }

  @Query(() => [WorkspaceMember], { name: 'workspaceMembers' })
  workspaceMembers(
    @Args() findManyWorkspaceMemberInput: FindManyWorkspaceMemberArgs,
  ) {
    return this.prisma.workspaceMember.findMany(findManyWorkspaceMemberInput);
  }

  @Mutation(() => WorkspaceMember, { name: 'createWorkspaceMember' })
  createWorkspaceMember(
    @Args() createWorkspaceMemberInput: CreateOneWorkspaceMemberArgs,
  ) {
    return this.prisma.workspaceMember.create(createWorkspaceMemberInput);
  }

  @Mutation(() => WorkspaceMember, { name: 'updateWorkspaceMember' })
  updateWorkspaceMember(
    @Args() updateWorkspaceMemberInput: UpdateOneWorkspaceMemberArgs,
  ) {
    return this.prisma.workspaceMember.update(updateWorkspaceMemberInput);
  }

  @Mutation(() => WorkspaceMember, { name: 'deleteWorkspaceMember' })
  deleteWorkspaceMember(
    @Args() deleteWorkspaceMember: DeleteOneWorkspaceMemberArgs,
  ) {
    return this.prisma.workspaceMember.delete(deleteWorkspaceMember);
  }

  @ResolveField(() => User)
  user(@Parent() workspaceMember: WorkspaceMember) {
    return this.prisma.workspaceMember
      .findUnique({
        where: {
          uuid: workspaceMember.uuid,
        },
      })
      .user();
  }

  @ResolveField(() => Workspace)
  workspace(@Parent() workspaceMember: WorkspaceMember) {
    return this.prisma.workspaceMember
      .findUnique({
        where: {
          uuid: workspaceMember.uuid,
        },
      })
      .workspace();
  }
}

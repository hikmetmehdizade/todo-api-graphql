import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser, WMRoles } from '../../decorators';
import {
  FindUniqueWorkspaceMemberArgs,
  User,
  Workspace,
  WorkspaceMember,
  WorkspaceMemberRole,
} from '../../@generated';
import { PrismaService } from '../../prisma.service';
import {
  CreateWorkspaceMemberArgs,
  DeleteWorkspaceMemberArgs,
  UpdateWorkspaceMemberArgs,
  WorkspaceMembersWhereArgs,
} from './workspace-member.args';
import { WorkspaceRolesGuard } from '../../guards/workspace-member-role';
import { UseGuards } from '@nestjs/common';

@UseGuards(WorkspaceRolesGuard)
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
  @WMRoles(
    WorkspaceMemberRole.ADMIN,
    WorkspaceMemberRole.OWNER,
    WorkspaceMemberRole.USER,
  )
  async workspaceMembers(
    @Args() workspaceMembersWhereArgs: WorkspaceMembersWhereArgs,
    @CurrentUser() user: User,
  ) {
    const members = await this.prisma.workspaceMember.findMany({
      ...workspaceMembersWhereArgs,
      where: {
        AND: [
          workspaceMembersWhereArgs.where,
          { workspace: { is: { uuid: user.currentWorkspaceId } } },
        ],
      },
    });

    return members;
  }

  @Mutation(() => WorkspaceMember, { name: 'createWorkspaceMember' })
  @WMRoles(WorkspaceMemberRole.ADMIN, WorkspaceMemberRole.OWNER)
  createWorkspaceMember(
    @Args() createWorkspaceMemberArgs: CreateWorkspaceMemberArgs,
  ) {
    const { role, userWhereUniqueInput, workspaceWhereUniqueInput } =
      createWorkspaceMemberArgs;

    return this.prisma.workspaceMember.create({
      data: {
        role,
        workspace: {
          connect: {
            uuid: workspaceWhereUniqueInput.uuid,
          },
        },
        user: {
          connect: {
            uuid: userWhereUniqueInput.uuid,
          },
        },
      },
    });
  }

  @Mutation(() => WorkspaceMember, { name: 'updateWorkspaceMember' })
  @WMRoles(WorkspaceMemberRole.ADMIN, WorkspaceMemberRole.OWNER)
  updateWorkspaceMember(
    @Args() updateWorkspaceMemberArgs: UpdateWorkspaceMemberArgs,
  ) {
    const { role, workspaceMemberWhereUniqueInput } = updateWorkspaceMemberArgs;
    return this.prisma.workspaceMember.update({
      where: {
        uuid: workspaceMemberWhereUniqueInput.uuid,
      },
      data: {
        role,
      },
    });
  }

  @Mutation(() => WorkspaceMember, { name: 'deleteWorkspaceMember' })
  @WMRoles(WorkspaceMemberRole.ADMIN, WorkspaceMemberRole.OWNER)
  deleteWorkspaceMember(
    @Args() deleteWorkspaceMemberArgs: DeleteWorkspaceMemberArgs,
  ) {
    const { workspaceMemberWhereUniqueInput } = deleteWorkspaceMemberArgs;
    return this.prisma.workspaceMember.delete({
      where: { uuid: workspaceMemberWhereUniqueInput.uuid },
    });
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

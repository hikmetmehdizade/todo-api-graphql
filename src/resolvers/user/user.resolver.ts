import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MutationPayload } from '../../types/mutation-payload';
import { User, Workspace, WorkspaceMemberRole } from '../../@generated';
import { CurrentUser, WMRoles } from '../../decorators';
import { PrismaService } from '../../prisma.service';
import { InviteUserToWorkspaceArgs } from './user.args';
import { UseGuards } from '@nestjs/common';
import { WorkspaceRolesGuard } from '../../guards/workspace-member-role';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@UseGuards(WorkspaceRolesGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly prisma: PrismaService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Mutation(() => MutationPayload, { name: 'inviteUserToWorkspace' })
  @WMRoles(WorkspaceMemberRole.ADMIN, WorkspaceMemberRole.OWNER)
  async inviteUserToWorkspace(
    @Args() inviteUserToWorkspaceArgs: InviteUserToWorkspaceArgs,
  ) {
    const { email, firstName, lastName, role, workspaceWhereUniqueInput } =
      inviteUserToWorkspaceArgs.data;
    const isExist = await this.userService.ensureUserIsExists(email);

    if (isExist) {
      const { _count } = await this.prisma.workspace.update({
        where: {
          uuid: workspaceWhereUniqueInput.uuid,
        },
        data: {
          members: {
            create: {
              role,
              user: {
                connect: {
                  email,
                },
              },
            },
          },
        },
        include: { _count: true },
      });

      return { _count };
    } else {
      const [user] = await this.prisma.$transaction([
        this.prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
          },
          include: {
            _count: true,
          },
        }),
        this.prisma.workspaceMember.create({
          data: {
            role,
            user: { connect: { email } },
            workspace: { connect: { uuid: workspaceWhereUniqueInput.uuid } },
          },
        }),
      ]);

      const token = this.authService.createAuthToken(user.email);

      console.log(token);

      return { _count: user._count };
    }
  }

  @Query(() => User, { name: 'me' })
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField(() => Workspace)
  currentWorkspace(@Parent() user: User) {
    return this.prisma.user
      .findUnique({
        where: {
          uuid: user.uuid,
        },
      })
      .currentWorkspace();
  }
}

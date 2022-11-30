import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser, WMRoles } from 'src/decorators';
import { WorkspaceRolesGuard } from 'src/guards/workspace-member-role';
import { PrismaService } from 'src/prisma.service';
import {
  DeleteOneWorkspaceArgs,
  FindUniqueWorkspaceArgs,
  Task,
  User,
  Workspace,
  WorkspaceMember,
  WorkspaceMemberCreateWithoutWorkspaceInput,
  WorkspaceMemberRole,
} from '../../@generated';
import {
  CreateWorkspaceArgs,
  WorkspacesWhereArgs,
  UpdateWorkspaceArgs,
  DeleteWorkspaceArgs,
  ChangeCurrentWorkspaceArgs,
} from './workspace.args';
import { WorkspaceService } from './workspace.service';

@UseGuards(WorkspaceRolesGuard)
@Resolver((of) => Workspace)
export class WorkspaceResolver {
  constructor(
    private prisma: PrismaService,
    private workspaceService: WorkspaceService,
  ) {}

  @WMRoles(
    WorkspaceMemberRole.OWNER,
    WorkspaceMemberRole.ADMIN,
    WorkspaceMemberRole.USER,
  )
  @Query((returns) => [Workspace], { name: 'workspaces' })
  findAll(
    @CurrentUser() user: User,
    @Args() workspacesWhereArgs: WorkspacesWhereArgs,
  ) {
    return this.prisma.workspace.findMany({
      ...workspacesWhereArgs,
      where: {
        AND: [
          workspacesWhereArgs.where,
          {
            members: {
              some: {
                user: {
                  uuid: user.uuid,
                },
              },
            },
          },
        ],
      },
    });
  }

  @WMRoles(
    WorkspaceMemberRole.OWNER,
    WorkspaceMemberRole.ADMIN,
    WorkspaceMemberRole.USER,
  )
  @Query(() => Workspace, { name: 'workspace' })
  async findOne(
    @CurrentUser() user: User,
    @Args() findUniqueWorkspaceArgs: FindUniqueWorkspaceArgs,
  ) {
    await this.workspaceService.ensureUserIsWorkspaceMember(
      user.email,
      findUniqueWorkspaceArgs.where.uuid,
    );

    return this.prisma.workspace.findUnique(findUniqueWorkspaceArgs);
  }

  @Mutation(() => Workspace, { name: 'createWorkspace' })
  async createWorkspace(
    @CurrentUser() user: User,
    @Args() createWorkspaceArgs: CreateWorkspaceArgs,
  ) {
    const { data } = createWorkspaceArgs;

    const OWNER: WorkspaceMemberCreateWithoutWorkspaceInput = {
      role: 'OWNER',
      user: {
        connect: {
          uuid: user.uuid,
        },
      },
    };

    const createdWorkspace = await this.prisma.workspace.create({
      data: {
        ...data,
        members: {
          create: [OWNER],
        },
        taskStatuses: {
          create: [{ title: 'Backlog' }],
        },
      },
    });

    if (!user.currentWorkspaceId) {
      await this.prisma.user.update({
        data: {
          currentWorkspace: {
            connect: {
              uuid: createdWorkspace.uuid,
            },
          },
        },
        where: {
          uuid: user.uuid,
        },
      });
    }

    return createdWorkspace;
  }

  @Mutation(() => Workspace, { name: 'updateWorkspace' })
  @WMRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.ADMIN)
  async updateWorkspace(
    @CurrentUser() user: User,
    @Args() updateWorkspaceArgs: UpdateWorkspaceArgs,
  ) {
    const { workspaceWhereUniqueInput, data } = updateWorkspaceArgs;
    await this.workspaceService.ensureUserIsWorkspaceOwnerOrAdmin(
      workspaceWhereUniqueInput.uuid,
      user.uuid,
    );
    return this.prisma.workspace.update({
      where: workspaceWhereUniqueInput,
      data,
    });
  }

  @Mutation(() => Workspace, { name: 'removeWorkspace' })
  @WMRoles(WorkspaceMemberRole.OWNER)
  async removeWorkspace(
    @CurrentUser() user: User,
    @Args()
    deleteWorkspaceArgs: DeleteWorkspaceArgs,
  ) {
    const { workspaceWhereUniqueInput } = deleteWorkspaceArgs;
    await this.workspaceService.ensureUserIsWorkspaceOwner(
      workspaceWhereUniqueInput.uuid,
      user.uuid,
    );

    return this.prisma.workspace.delete({ where: workspaceWhereUniqueInput });
  }

  @Mutation(() => Workspace, { name: 'changeCurrentWorkspace' })
  async changeCurrentWorkspace(
    @CurrentUser() user: User,
    @Args() changeCurrentWorkspaceArgs: ChangeCurrentWorkspaceArgs,
  ) {
    const { workspaceWhereUniqueInput } = changeCurrentWorkspaceArgs;
    await this.workspaceService.ensureUserIsWorkspaceMember(
      user.email,
      workspaceWhereUniqueInput.uuid,
    );
    await this.prisma.user.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        currentWorkspaceId: workspaceWhereUniqueInput.uuid,
      },
    });

    return this.prisma.workspace.findUnique({
      where: {
        uuid: workspaceWhereUniqueInput.uuid,
      },
    });
  }

  @ResolveField(() => [WorkspaceMember])
  members(@Parent() workspace: Workspace) {
    return this.prisma.workspace
      .findUnique({ where: { uuid: workspace.uuid } })
      .members();
  }

  @ResolveField(() => [Task])
  tasks(@Parent() workspace: Workspace) {
    return this.prisma.workspace
      .findUnique({ where: { uuid: workspace.uuid } })
      .tasks();
  }
}

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
  CreateOneWorkspaceArgs,
  DeleteOneWorkspaceArgs,
  FindUniqueWorkspaceArgs,
  Task,
  UpdateOneWorkspaceArgs,
  User,
  Workspace,
  WorkspaceMember,
  WorkspaceMemberCreateWithoutWorkspaceInput,
  WorkspaceMemberRole,
} from '../../../prisma/generated/types';
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
  findAll(@CurrentUser() user: User) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: user.uuid,
          },
        },
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
  createWorkspace(
    @CurrentUser() user: User,
    @Args() createWorkspaceInput: CreateOneWorkspaceArgs,
  ) {
    const { data } = createWorkspaceInput;
    const OWNER: WorkspaceMemberCreateWithoutWorkspaceInput = {
      role: 'OWNER',
      user: {
        connect: {
          uuid: user.uuid,
        },
      },
    };

    return this.prisma.workspace.create({
      data: {
        ...data,
        members: {
          ...data.members,
          create: [OWNER],
        },
      },
    });
  }
  @Mutation(() => Workspace, { name: 'updateWorkspace' })
  @WMRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.ADMIN)
  async updateWorkspace(
    @CurrentUser() user: User,
    @Args() updateWorkspaceInput: UpdateOneWorkspaceArgs,
  ) {
    await this.workspaceService.ensureUserIsWorkspaceOwnerOrAdmin(
      updateWorkspaceInput.where.uuid,
      user.uuid,
    );
    return this.prisma.workspace.update(updateWorkspaceInput);
  }

  @Mutation(() => Workspace, { name: 'removeWorkspace' })
  @WMRoles(WorkspaceMemberRole.OWNER)
  async removeWorkspace(
    @CurrentUser() user: User,
    @Args()
    deleteOneWorkspaceArgs: DeleteOneWorkspaceArgs,
  ) {
    await this.workspaceService.ensureUserIsWorkspaceOwner(
      deleteOneWorkspaceArgs.where.uuid,
      user.uuid,
    );

    return this.prisma.workspace.delete(deleteOneWorkspaceArgs);
  }

  @Mutation(() => Workspace, { name: 'changeCurrentWorkspace' })
  async changeCurrentWorkspace(
    @CurrentUser() user: User,
    @Args('workspaceId') workspaceId: string,
  ) {
    await this.workspaceService.ensureUserIsWorkspaceMember(
      user.email,
      workspaceId,
    );
    await this.prisma.user.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        currentWorkspaceId: workspaceId,
      },
    });

    return this.prisma.workspace.findUnique({
      where: {
        uuid: workspaceId,
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

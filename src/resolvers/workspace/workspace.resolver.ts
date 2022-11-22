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
  CreateOneWorkspaceArgs,
  DeleteOneWorkspaceArgs,
  FindUniqueWorkspaceArgs,
  Task,
  UpdateOneWorkspaceArgs,
  User,
  Workspace,
  WorkspaceMember,
  WorkspaceMemberCreateWithoutWorkspaceInput,
} from '../../../prisma/generated/types';
import { WorkspaceService } from './workspace.service';

@Resolver((of) => Workspace)
export class WorkspaceResolver {
  constructor(
    private prisma: PrismaService,
    private workspaceService: WorkspaceService,
  ) {}

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

  @Mutation(() => Workspace)
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

  @Mutation(() => Workspace)
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

  @Mutation(() => Workspace)
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

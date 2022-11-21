import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/guards/auth';
import { PrismaService } from 'src/prisma.service';
import {
  CreateOneWorkspaceArgs,
  DeleteOneWorkspaceArgs,
  FindUniqueWorkspaceArgs,
  Task,
  UpdateOneWorkspaceArgs,
  Workspace,
  WorkspaceMember,
} from '../../../prisma/generated/types';

@Resolver((of) => Workspace)
export class WorkspaceResolver {
  constructor(private prisma: PrismaService) {}

  @Query((returns) => [Workspace], { name: 'workspaces' })
  findAll() {
    return this.prisma.workspace.findMany();
  }

  @Query(() => Workspace, { name: 'workspace' })
  findOne(@Args() findUniqueWorkspaceArgs: FindUniqueWorkspaceArgs) {
    return this.prisma.workspace.findUnique(findUniqueWorkspaceArgs);
  }

  @Mutation(() => Workspace)
  createWorkspace(@Args() createWorkspaceInput: CreateOneWorkspaceArgs) {
    return this.prisma.workspace.create(createWorkspaceInput);
  }

  @Mutation(() => Workspace)
  updateWorkspace(@Args() updateWorkspaceInput: UpdateOneWorkspaceArgs) {
    return this.prisma.workspace.update(updateWorkspaceInput);
  }

  @Mutation(() => Workspace)
  removeWorkspace(
    @Args()
    deleteOneWorkspaceArgs: DeleteOneWorkspaceArgs,
  ) {
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

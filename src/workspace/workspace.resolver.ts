import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import {
  Workspace,
  CreateOneWorkspaceArgs,
  WorkspaceMember,
  FindUniqueWorkspaceArgs,
  UpdateOneWorkspaceArgs,
  DeleteOneWorkspaceArgs,
  Task,
} from '../../prisma/generated/types';

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Workspace], { name: 'workspaces' })
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

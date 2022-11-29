import { Prisma } from '@prisma/client';
import { MutationPayload, Workspace } from '../../../types';

export type WorkspacesWhereInput = Pick<
  Prisma.WorkspaceFindManyArgs,
  'where' | 'orderBy' | 'skip' | 'take'
>;

export interface WorkspacesData {
  workspaces: Workspace[];
}

export interface CreateWorkspaceInput {
  data: Pick<Prisma.WorkspaceCreateInput, 'name'>;
}

export interface CreateWorkspaceData {
  createWorkspace: MutationPayload;
}

export interface UpdateWorkspaceInput {
  data: Pick<Prisma.WorkspaceUpdateInput, 'name'>;
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
}

export interface UpdateWorkspaceData {
  updateWorkspace: MutationPayload;
}

export interface DeleteWorkspaceInput {
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
}

export interface DeleteWorkspaceData {
  deleteWorkspace: MutationPayload;
}

export interface ChangeCurrentWorkspaceInput {
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
}

export interface ChangeCurrentWorkspaceData {
  changeCurrentWorkspace: MutationPayload;
}

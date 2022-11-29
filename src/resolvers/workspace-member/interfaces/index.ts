import { Prisma, WorkspaceMemberRole } from '@prisma/client';
import { MutationPayload } from '../../../types';

export interface CreateWorkspaceMemberInput {
  role: WorkspaceMemberRole;
  userWhereUniqueInput: Prisma.UserWhereUniqueInput;
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
}

export interface CreateWorkspaceMemberData {
  createWorkspaceMember: MutationPayload;
}

export interface UpdateWorkspaceMemberInput {
  workspaceMemberWhereUniqueInput: Prisma.WorkspaceMemberWhereUniqueInput;
  role: WorkspaceMemberRole;
}

export interface UpdateWorkspaceMemberData {
  updateWorkspaceMember: MutationPayload;
}

export interface DeleteWorkspaceMemberInput {
  workspaceMemberWhereUniqueInput: Prisma.WorkspaceMemberWhereUniqueInput;
}

export interface DeleteWorkspaceMemberData {
  deleteWorkspaceMember: MutationPayload;
}

export type WorkspaceMembersWhereInput = Pick<
  Prisma.WorkspaceMemberFindManyArgs,
  'where' | 'orderBy' | 'skip' | 'take'
>;

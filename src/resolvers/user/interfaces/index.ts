import { Prisma, WorkspaceMemberRole } from '@prisma/client';
import { MutationPayload } from '../../../types';

export interface InviteUserToWorkspace
  extends Pick<Prisma.UserCreateInput, 'email' | 'firstName' | 'lastName'> {
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
  role: WorkspaceMemberRole;
}

export interface InviteUserToWorkspaceInput {
  data: InviteUserToWorkspace;
}

export interface InviteUserToWorkspaceData {
  inviteUserToWorkspace: MutationPayload;
}

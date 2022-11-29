import { Prisma } from '@prisma/client';
import { MutationPayload, WorkspaceTaskStatus } from '../../../types';

export interface CreateWorkspaceTaskStatusInput {
  data: Pick<Prisma.WorkspaceTaskStatusCreateInput, 'title'>;
  workspaceWhereUniqueInput?: Prisma.WorkspaceWhereUniqueInput;
}

export interface UpdateWorkspaceTaskStatusInput {
  data: Pick<Prisma.WorkspaceTaskStatusUpdateInput, 'title'>;
  workspaceTaskStatusWhereUniqueInput: Prisma.WorkspaceTaskStatusWhereUniqueInput;
}

export interface DeleteWorkspaceTaskStatusInput {
  workspaceTaskStatusWhereUniqueInput: Prisma.WorkspaceTaskStatusWhereUniqueInput;
}

export interface CreateWorkspaceTaskStatusData {
  createWorkspaceTaskStatus: MutationPayload;
}

export interface UpdateWorkspaceTaskStatusData {
  updateWorkspaceTaskStatus: MutationPayload;
}

export interface DeleteWorkspaceTaskStatusData {
  deleteWorkspaceTaskStatus: MutationPayload;
}

export type WorkspaceTaskStatusesInput = Prisma.WorkspaceTaskStatusFindManyArgs;

export interface WorkspaceTaskStatusesData {
  workspaceTaskStatuses: WorkspaceTaskStatus[];
}

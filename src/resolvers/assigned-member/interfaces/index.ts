import { Prisma, TaskRole } from '@prisma/client';
import { MutationPayload } from '../../../types';

export interface CreateAssignedMemberInput {
  role?: TaskRole;
  workspaceMemberWhereUniqueInput: Prisma.WorkspaceMemberWhereUniqueInput;
  taskWhereUniqueInput: Prisma.TaskWhereUniqueInput;
}

export interface CreateAssignedMemberData {
  createAssignedMember: MutationPayload;
}

export interface UpdateAssignedMemberInput {
  role: TaskRole;
  assignedMemberWhereUniqueInput: Prisma.AssignedMemberWhereUniqueInput;
}

export interface UpdateAssignedMemberData {
  updateAssignedMember: MutationPayload;
}

export interface DeleteAssignedMemberInput {
  assignedMemberWhereUniqueInput: Prisma.AssignedMemberWhereUniqueInput;
}

export interface DeleteAssignedMemberData {
  deleteAssignedMember: MutationPayload;
}

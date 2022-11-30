import { Prisma, TaskRole } from '@prisma/client';
import { MutationPayload } from '../../../types';

export interface ConnectWorkspaceMember {
  workspaceMemberWhereUniqueInput: Prisma.WorkspaceMemberWhereUniqueInput;
  role: TaskRole;
}

export interface CreateTaskInput {
  data: Pick<Prisma.TaskCreateInput, 'title' | 'description'>;
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
  members: ConnectWorkspaceMember[];
}

export interface UpdateTaskInputData
  extends Pick<Prisma.TaskUpdateInput, 'title' | 'description'> {
  assignedMembers?: Pick<
    Prisma.AssignedMemberUpdateManyWithoutTaskNestedInput,
    'create' | 'createMany' | 'delete' | 'deleteMany' | 'update' | 'updateMany'
  >;
  status?: Pick<
    Prisma.WorkspaceTaskStatusUpdateOneRequiredWithoutTasksNestedInput,
    'connect'
  >;
}

export interface UpdateTaskInput {
  data: UpdateTaskInputData;
  taskWhereUniqueInput: Partial<Prisma.TaskWhereUniqueInput>;
}

export interface DeleteTaskInput {
  taskWhereUniqueInput: Partial<Prisma.TaskWhereUniqueInput>;
}

export interface DeleteTaskData {
  deleteTask: MutationPayload;
}

export interface UpdateTaskData {
  updateTask: MutationPayload;
}

export interface CreateTaskData {
  createTaskInput: MutationPayload;
}

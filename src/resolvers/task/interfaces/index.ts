import { Prisma, TaskRole } from '@prisma/client';

export interface ConnectWorkspaceMember {
  workspaceMemberWhereUniqueInput: Prisma.WorkspaceMemberWhereUniqueInput;
  role: TaskRole;
}

export interface CreateTaskInput {
  data: Pick<Prisma.TaskCreateInput, 'title' | 'description'>;
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
  members: ConnectWorkspaceMember[];
}

interface UpdateTaskInputData
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

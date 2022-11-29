import {
  Workspace as BaseWorkspace,
  User as BaseUser,
  Task as BaseTask,
  WorkspaceTaskStatus as BaseWorkspaceTaskStatus,
  UserIdentity as BaseUserIdentity,
  WorkspaceMember as BaseWorkspaceMember,
  AssignedMember as BaseAssignedMember,
} from '@prisma/client';

export interface Workspace extends BaseWorkspace {
  members: WorkspaceMember[];
  tasks: Task[];
  taskStatuses: WorkspaceTaskStatus[];
  user: User[];
}

export interface User extends BaseUser {
  currentWorkspace?: Workspace;
  workspaceParticipation: WorkspaceMember[];
}

export interface Task extends BaseTask {
  workspace: Workspace;
  assignedMembers: AssignedMember[];
  status: WorkspaceTaskStatus;
}

export interface WorkspaceTaskStatus extends BaseWorkspaceTaskStatus {
  workspace: Workspace;
  tasks: Task[];
}

export type UserIdentity = BaseUserIdentity;

export interface WorkspaceMember extends BaseWorkspaceMember {
  workspace: Workspace;
  tasks: AssignedMember[];
  user: User;
}

export interface AssignedMember extends BaseAssignedMember {
  member: WorkspaceMember;
  task: Task;
}

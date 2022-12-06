import { Request, Response } from 'express';
import {
  Workspace as Workspace$1,
  User as User$1,
  Task as Task$1,
  WorkspaceTaskStatus as WorkspaceTaskStatus$1,
  UserIdentity as UserIdentity$1,
  WorkspaceMember as WorkspaceMember$1,
  AssignedMember as AssignedMember$1,
  Prisma,
  WorkspaceMemberRole,
  TaskRole,
} from '@prisma/client';
export { TaskRole, WorkspaceMemberRole } from '@prisma/client';

interface Workspace extends Workspace$1 {
  members: WorkspaceMember[];
  tasks: Task[];
  taskStatuses: WorkspaceTaskStatus[];
  user: User[];
}
interface User extends User$1 {
  currentWorkspace?: Workspace;
  workspaceParticipation: WorkspaceMember[];
}
interface Task extends Task$1 {
  workspace: Workspace;
  assignedMembers: AssignedMember[];
  status: WorkspaceTaskStatus;
}
interface WorkspaceTaskStatus extends WorkspaceTaskStatus$1 {
  workspace: Workspace;
  tasks: Task[];
}
type UserIdentity = UserIdentity$1;
interface WorkspaceMember extends WorkspaceMember$1 {
  workspace: Workspace;
  tasks: AssignedMember[];
  user: User;
}
interface AssignedMember extends AssignedMember$1 {
  member: WorkspaceMember;
  task: Task;
}

interface CreateWorkspaceTaskStatusInput {
  data: Pick<Prisma.WorkspaceTaskStatusCreateInput, 'title'>;
  workspaceWhereUniqueInput?: Prisma.WorkspaceWhereUniqueInput;
}
interface UpdateWorkspaceTaskStatusInput {
  data: Pick<Prisma.WorkspaceTaskStatusUpdateInput, 'title'>;
  workspaceTaskStatusWhereUniqueInput: Prisma.WorkspaceTaskStatusWhereUniqueInput;
}
interface DeleteWorkspaceTaskStatusInput {
  workspaceTaskStatusWhereUniqueInput: Prisma.WorkspaceTaskStatusWhereUniqueInput;
}
interface CreateWorkspaceTaskStatusData {
  createWorkspaceTaskStatus: MutationPayload;
}
interface UpdateWorkspaceTaskStatusData {
  updateWorkspaceTaskStatus: MutationPayload;
}
interface DeleteWorkspaceTaskStatusData {
  deleteWorkspaceTaskStatus: MutationPayload;
}
type WorkspaceTaskStatusesInput = Prisma.WorkspaceTaskStatusFindManyArgs;
interface WorkspaceTaskStatusesData {
  workspaceTaskStatuses: WorkspaceTaskStatus[];
}

type WorkspacesWhereInput = Pick<
  Prisma.WorkspaceFindManyArgs,
  'where' | 'orderBy' | 'skip' | 'take'
>;
interface WorkspacesData {
  workspaces: Workspace[];
}
interface CreateWorkspaceInput {
  data: Pick<Prisma.WorkspaceCreateInput, 'name'>;
}
interface CreateWorkspaceData {
  createWorkspace: MutationPayload;
}
interface UpdateWorkspaceInput {
  data: Pick<Prisma.WorkspaceUpdateInput, 'name'>;
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
}
interface UpdateWorkspaceData {
  updateWorkspace: MutationPayload;
}
interface DeleteWorkspaceInput {
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
}
interface DeleteWorkspaceData {
  deleteWorkspace: MutationPayload;
}
interface ChangeCurrentWorkspaceInput {
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
}
interface ChangeCurrentWorkspaceData {
  changeCurrentWorkspace: Workspace;
}

interface CreateWorkspaceMemberInput {
  role: WorkspaceMemberRole;
  userWhereUniqueInput: Prisma.UserWhereUniqueInput;
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
}
interface CreateWorkspaceMemberData {
  createWorkspaceMember: MutationPayload;
}
interface UpdateWorkspaceMemberInput {
  workspaceMemberWhereUniqueInput: Prisma.WorkspaceMemberWhereUniqueInput;
  role: WorkspaceMemberRole;
}
interface UpdateWorkspaceMemberData {
  updateWorkspaceMember: MutationPayload;
}
interface DeleteWorkspaceMemberInput {
  workspaceMemberWhereUniqueInput: Prisma.WorkspaceMemberWhereUniqueInput;
}
interface DeleteWorkspaceMemberData {
  deleteWorkspaceMember: MutationPayload;
}
type WorkspaceMembersWhereInput = Pick<
  Prisma.WorkspaceMemberFindManyArgs,
  'where' | 'orderBy' | 'skip' | 'take'
>;
interface WorkspaceMembersData {
  workspaceMembers: WorkspaceMember[];
}

interface CreateAssignedMemberInput {
  role?: TaskRole;
  workspaceMemberWhereUniqueInput: Prisma.WorkspaceMemberWhereUniqueInput;
  taskWhereUniqueInput: Prisma.TaskWhereUniqueInput;
}
interface CreateAssignedMemberData {
  createAssignedMember: MutationPayload;
}
interface UpdateAssignedMemberInput {
  role: TaskRole;
  assignedMemberWhereUniqueInput: Prisma.AssignedMemberWhereUniqueInput;
}
interface UpdateAssignedMemberData {
  updateAssignedMember: MutationPayload;
}
interface DeleteAssignedMemberInput {
  assignedMemberWhereUniqueInput: Prisma.AssignedMemberWhereUniqueInput;
}
interface DeleteAssignedMemberData {
  deleteAssignedMember: MutationPayload;
}

interface ConnectWorkspaceMember {
  workspaceMemberWhereUniqueInput: Prisma.WorkspaceMemberWhereUniqueInput;
  role: TaskRole;
}
interface CreateTaskInput {
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
interface UpdateTaskInput {
  data: UpdateTaskInputData;
  taskWhereUniqueInput: Partial<Prisma.TaskWhereUniqueInput>;
}
interface DeleteTaskInput {
  taskWhereUniqueInput: Partial<Prisma.TaskWhereUniqueInput>;
}
interface DeleteTaskData {
  deleteTask: MutationPayload;
}
interface UpdateTaskData {
  updateTask: MutationPayload;
}
interface CreateTaskData {
  createTaskInput: MutationPayload;
}

interface RegistrationInputData
  extends Pick<Prisma.UserCreateInput, 'email' | 'firstName' | 'lastName'> {
  password: string;
}
interface RegistrationInput {
  data: RegistrationInputData;
}
interface LoginInput {
  email: string;
  password: string;
}
interface RegistrationData {
  registration: User;
}
interface LoginData {
  login: User;
}

interface InviteUserToWorkspace
  extends Pick<Prisma.UserCreateInput, 'email' | 'firstName' | 'lastName'> {
  workspaceWhereUniqueInput: Prisma.WorkspaceWhereUniqueInput;
  role: WorkspaceMemberRole;
}
interface InviteUserToWorkspaceInput {
  data: InviteUserToWorkspace;
}
interface InviteUserToWorkspaceData {
  inviteUserToWorkspace: MutationPayload;
}

interface Ctx {
  req: Request;
  res: Response;
  user: User;
}
interface TokenPayload {
  email: string;
}
interface MutationPayload {
  _count: number;
}
interface PaginationType {
  skip?: number;
  take?: number;
}
declare enum SubscriptionAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
interface SubDeletePayload {
  deletedId: string;
}
interface SubscriptionPayloadType<T = any> {
  payload: T | SubDeletePayload;
  action: SubscriptionAction;
}

export {
  AssignedMember,
  ChangeCurrentWorkspaceData,
  ChangeCurrentWorkspaceInput,
  ConnectWorkspaceMember,
  CreateAssignedMemberData,
  CreateAssignedMemberInput,
  CreateTaskData,
  CreateTaskInput,
  CreateWorkspaceData,
  CreateWorkspaceInput,
  CreateWorkspaceMemberData,
  CreateWorkspaceMemberInput,
  CreateWorkspaceTaskStatusData,
  CreateWorkspaceTaskStatusInput,
  Ctx,
  DeleteAssignedMemberData,
  DeleteAssignedMemberInput,
  DeleteTaskData,
  DeleteTaskInput,
  DeleteWorkspaceData,
  DeleteWorkspaceInput,
  DeleteWorkspaceMemberData,
  DeleteWorkspaceMemberInput,
  DeleteWorkspaceTaskStatusData,
  DeleteWorkspaceTaskStatusInput,
  InviteUserToWorkspace,
  InviteUserToWorkspaceData,
  InviteUserToWorkspaceInput,
  LoginData,
  LoginInput,
  MutationPayload,
  PaginationType,
  RegistrationData,
  RegistrationInput,
  RegistrationInputData,
  SubDeletePayload,
  SubscriptionAction,
  SubscriptionPayloadType,
  Task,
  TokenPayload,
  UpdateAssignedMemberData,
  UpdateAssignedMemberInput,
  UpdateTaskData,
  UpdateTaskInput,
  UpdateTaskInputData,
  UpdateWorkspaceData,
  UpdateWorkspaceInput,
  UpdateWorkspaceMemberData,
  UpdateWorkspaceMemberInput,
  UpdateWorkspaceTaskStatusData,
  UpdateWorkspaceTaskStatusInput,
  User,
  UserIdentity,
  Workspace,
  WorkspaceMember,
  WorkspaceMembersData,
  WorkspaceMembersWhereInput,
  WorkspaceTaskStatus,
  WorkspaceTaskStatusesData,
  WorkspaceTaskStatusesInput,
  WorkspacesData,
  WorkspacesWhereInput,
};

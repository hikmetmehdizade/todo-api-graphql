import {
  ConnectWorkspaceMember,
  CreateTaskInput,
  DeleteTaskInput,
  UpdateTaskInput,
  UpdateTaskInputData,
} from './interfaces';
import {
  TaskCreateInput,
  WorkspaceMemberWhereUniqueInput,
  WorkspaceWhereUniqueInput,
  TaskRole,
  TaskUpdateInput,
  TaskWhereUniqueInput,
  WorkspaceTaskStatusUpdateOneRequiredWithoutTasksNestedInput,
  AssignedMemberUpdateManyWithoutTaskNestedInput,
  Task,
} from '../../@generated';
import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { SubscriptionPayload } from 'src/utils/subscription';

@InputType()
class CreateTaskInputData extends PickType(TaskCreateInput, [
  'title',
  'description',
]) {}

@InputType()
class ConnectWorkspaceMemberInputType implements ConnectWorkspaceMember {
  @Field(() => TaskRole, { nullable: false })
  role: keyof typeof TaskRole;

  @Field(() => WorkspaceMemberWhereUniqueInput, { nullable: false })
  workspaceMemberWhereUniqueInput: WorkspaceMemberWhereUniqueInput;
}

@ArgsType()
export class CreateTaskArgs implements CreateTaskInput {
  @Field(() => CreateTaskInputData, { nullable: false })
  data: CreateTaskInputData;

  @Field(() => WorkspaceWhereUniqueInput, { nullable: false })
  workspaceWhereUniqueInput: WorkspaceWhereUniqueInput;

  @Field(() => [ConnectWorkspaceMemberInputType], { nullable: false })
  members: Array<ConnectWorkspaceMemberInputType>;
}

@InputType()
class WorkspaceTaskStatusConnectInputType extends PickType(
  WorkspaceTaskStatusUpdateOneRequiredWithoutTasksNestedInput,
  ['connect'],
) {}

@InputType()
class AssignedMemberUpdateManyWithoutTaskNestedInputType extends PickType(
  AssignedMemberUpdateManyWithoutTaskNestedInput,
  ['create', 'createMany', 'delete', 'deleteMany', 'update', 'updateMany'],
) {}

@InputType()
class UpdateTaskInputType
  extends PickType(TaskUpdateInput, ['title', 'description'])
  implements UpdateTaskInputData
{
  @Field(() => WorkspaceTaskStatusConnectInputType, {
    nullable: true,
  })
  status?: WorkspaceTaskStatusConnectInputType;

  @Field(() => AssignedMemberUpdateManyWithoutTaskNestedInputType, {
    nullable: true,
  })
  assignedMembers?: AssignedMemberUpdateManyWithoutTaskNestedInputType;
}

@ArgsType()
export class UpdateTaskArgs implements UpdateTaskInput {
  @Field(() => UpdateTaskInputType, { nullable: false })
  data: UpdateTaskInputType;

  @Field(() => TaskWhereUniqueInput, { nullable: false })
  taskWhereUniqueInput: TaskWhereUniqueInput;
}

@ArgsType()
export class DeleteTaskArgs implements DeleteTaskInput {
  @Field(() => TaskWhereUniqueInput, { nullable: false })
  taskWhereUniqueInput: TaskWhereUniqueInput;
}

@ObjectType()
export class TaskSubscriptionPayload extends SubscriptionPayload(Task) {}

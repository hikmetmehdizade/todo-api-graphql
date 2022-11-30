import { PickType, ArgsType, InputType, Field } from '@nestjs/graphql';
import {
  FindManyWorkspaceArgs,
  WorkspaceCreateInput,
  WorkspaceUpdateInput,
  WorkspaceWhereUniqueInput,
} from 'src/@generated';
import {
  ChangeCurrentWorkspaceInput,
  CreateWorkspaceInput,
  DeleteWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspacesWhereInput,
} from './interfaces';

@ArgsType()
export class WorkspacesWhereArgs
  extends PickType(FindManyWorkspaceArgs, ['where', 'orderBy', 'take', 'skip'])
  implements WorkspacesWhereInput {}

@InputType()
export class CreateWorkspaceInputData extends PickType(WorkspaceCreateInput, [
  'name',
]) {}

@ArgsType()
export class CreateWorkspaceArgs implements CreateWorkspaceInput {
  @Field(() => CreateWorkspaceInputData, { nullable: false })
  data: CreateWorkspaceInputData;
}

@InputType()
export class UpdateWorkspaceInputData extends PickType(WorkspaceUpdateInput, [
  'name',
]) {}

@ArgsType()
export class UpdateWorkspaceArgs implements UpdateWorkspaceInput {
  @Field(() => WorkspaceWhereUniqueInput, { nullable: false })
  workspaceWhereUniqueInput: WorkspaceWhereUniqueInput;

  @Field(() => UpdateWorkspaceInputData, { nullable: false })
  data: UpdateWorkspaceInputData;
}

@ArgsType()
export class DeleteWorkspaceArgs implements DeleteWorkspaceInput {
  @Field(() => WorkspaceWhereUniqueInput, { nullable: false })
  workspaceWhereUniqueInput: WorkspaceWhereUniqueInput;
}

@ArgsType()
export class ChangeCurrentWorkspaceArgs implements ChangeCurrentWorkspaceInput {
  @Field(() => WorkspaceWhereUniqueInput, { nullable: false })
  workspaceWhereUniqueInput: WorkspaceWhereUniqueInput;
}

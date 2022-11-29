import { PickType, InputType, ArgsType, Field } from '@nestjs/graphql';
import {
  FindManyWorkspaceTaskStatusArgs,
  WorkspaceTaskStatusCreateInput as BaseWorkspaceTaskStatusCreateInput,
  WorkspaceWhereUniqueInput,
} from '../../@generated';
import {
  WorkspaceTaskStatusesInput,
  CreateWorkspaceTaskStatusInput,
} from './interfaces';
import { Type } from 'class-transformer';

@ArgsType()
export class WorkspaceTaskStatusesArgs
  extends FindManyWorkspaceTaskStatusArgs
  implements WorkspaceTaskStatusesInput {}

@InputType()
export class WorkspaceTaskStatusCreateInput extends PickType(
  BaseWorkspaceTaskStatusCreateInput,
  ['title'],
) {}

@ArgsType()
export class CreateWorkspaceTaskStatusArgs
  implements CreateWorkspaceTaskStatusInput
{
  @Field(() => WorkspaceTaskStatusCreateInput, { nullable: false })
  @Type(() => WorkspaceTaskStatusCreateInput)
  data: WorkspaceTaskStatusCreateInput;

  @Field(() => WorkspaceWhereUniqueInput, { nullable: true })
  @Type(() => WorkspaceWhereUniqueInput)
  workspaceWhereUniqueInput?: WorkspaceWhereUniqueInput;
}

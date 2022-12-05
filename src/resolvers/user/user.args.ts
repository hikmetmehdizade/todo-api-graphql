import { ArgsType, Field, InputType, PickType } from '@nestjs/graphql';
import {
  UserCreateInput,
  WorkspaceWhereUniqueInput,
  WorkspaceMemberRole,
} from '../../@generated';
import {
  InviteUserToWorkspaceInput as BaseInviteUserToWorkspaceInput,
  InviteUserToWorkspace,
} from './interfaces';

@InputType()
class InviteUserToWorkspaceInput
  extends PickType(UserCreateInput, ['email', 'firstName', 'lastName'])
  implements InviteUserToWorkspace
{
  @Field(() => WorkspaceWhereUniqueInput)
  workspaceWhereUniqueInput: WorkspaceWhereUniqueInput;

  @Field(() => WorkspaceMemberRole)
  role: keyof typeof WorkspaceMemberRole;
}

@ArgsType()
export class InviteUserToWorkspaceArgs
  implements BaseInviteUserToWorkspaceInput
{
  @Field(() => InviteUserToWorkspaceInput)
  data: InviteUserToWorkspaceInput;
}

import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  UserWhereUniqueInput,
  WorkspaceMemberRole,
  WorkspaceWhereUniqueInput,
  WorkspaceMemberWhereUniqueInput,
  WorkspaceMemberWhereInput,
  WorkspaceMemberOrderByWithRelationInput,
} from '../../@generated';
import {
  CreateWorkspaceMemberInput,
  DeleteWorkspaceMemberInput,
  UpdateWorkspaceMemberInput,
  WorkspaceMembersWhereInput,
} from './interfaces';

@ArgsType()
export class CreateWorkspaceMemberArgs implements CreateWorkspaceMemberInput {
  @Field(() => WorkspaceMemberRole, { nullable: false })
  role: keyof typeof WorkspaceMemberRole;

  @Field(() => UserWhereUniqueInput, { nullable: false })
  userWhereUniqueInput: UserWhereUniqueInput;

  @Field(() => WorkspaceWhereUniqueInput, { nullable: false })
  workspaceWhereUniqueInput: WorkspaceWhereUniqueInput;
}

@ArgsType()
export class UpdateWorkspaceMemberArgs implements UpdateWorkspaceMemberInput {
  @Field(() => WorkspaceMemberRole, { nullable: false })
  role: keyof typeof WorkspaceMemberRole;

  @Field(() => WorkspaceWhereUniqueInput, { nullable: false })
  workspaceMemberWhereUniqueInput: WorkspaceMemberWhereUniqueInput;
}

@ArgsType()
export class DeleteWorkspaceMemberArgs implements DeleteWorkspaceMemberInput {
  @Field(() => WorkspaceWhereUniqueInput, { nullable: false })
  workspaceMemberWhereUniqueInput: WorkspaceMemberWhereUniqueInput;
}

@ArgsType()
export class WorkspaceMembersWhereArgs implements WorkspaceMembersWhereInput {
  @Field(() => WorkspaceMemberWhereInput, { nullable: true })
  where?: WorkspaceMemberWhereInput;

  @Field(() => [WorkspaceMemberOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<WorkspaceMemberOrderByWithRelationInput>;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => Int, { nullable: true })
  skip?: number;
}

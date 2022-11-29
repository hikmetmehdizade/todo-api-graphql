import { ArgsType, Field } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import {
  AssignedMemberWhereUniqueInput,
  TaskRole,
  TaskWhereUniqueInput,
  WorkspaceMemberWhereUniqueInput,
} from '../../@generated';
import {
  CreateAssignedMemberInput,
  DeleteAssignedMemberInput,
  UpdateAssignedMemberInput,
} from './interfaces';

@ArgsType()
export class CreateAssignedMemberArgs implements CreateAssignedMemberInput {
  @Field(() => TaskRole, { nullable: true, defaultValue: TaskRole.EXECUTOR })
  role?: keyof typeof TaskRole;

  @Field(() => WorkspaceMemberWhereUniqueInput, { nullable: false })
  workspaceMemberWhereUniqueInput: WorkspaceMemberWhereUniqueInput;

  @Field(() => TaskWhereUniqueInput, { nullable: false })
  taskWhereUniqueInput: TaskWhereUniqueInput;
}

@ArgsType()
export class UpdateAssignedMemberArgs implements UpdateAssignedMemberInput {
  @Field(() => TaskRole, { nullable: false })
  role: keyof typeof TaskRole;

  @Field(() => AssignedMemberWhereUniqueInput, { nullable: false })
  assignedMemberWhereUniqueInput: AssignedMemberWhereUniqueInput;
}

@ArgsType()
export class DeleteAssignedMemberArgs implements DeleteAssignedMemberInput {
  @Field(() => AssignedMemberWhereUniqueInput, { nullable: false })
  assignedMemberWhereUniqueInput: AssignedMemberWhereUniqueInput;
}

import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { UserWhereUniqueInput } from '../../@generated';

@ArgsType()
export class InviteUserToWorkspaceInput {
  @Field(() => UserWhereUniqueInput, { nullable: true })
  @Type(() => UserWhereUniqueInput)
  userWhereUniqueInput?: UserWhereUniqueInput;
}

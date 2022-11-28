import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { UserWhereUniqueInput } from '../../../prisma/generated/types';

@ArgsType()
export class InviteUserToWorkspaceInput {
  @Field(() => UserWhereUniqueInput, { nullable: true })
  @Type(() => UserWhereUniqueInput)
  userWhereUniqueInput?: UserWhereUniqueInput;
}

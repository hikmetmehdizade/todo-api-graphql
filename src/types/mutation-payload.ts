import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MutationPayload as BaseMutationPayload } from './index';

@ObjectType()
export class MutationPayload implements BaseMutationPayload {
  @Field(() => Int, { nullable: false })
  _count: number;
}

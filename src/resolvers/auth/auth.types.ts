import { Field, InputType, PickType } from '@nestjs/graphql';
import { UserCreateInput } from 'prisma/generated/types';

@InputType()
export class RegistrationInput extends PickType(UserCreateInput, [
  'email',
  'firstName',
  'lastName',
]) {
  @Field()
  password: string;
}
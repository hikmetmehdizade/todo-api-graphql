import { ArgsType, Field, InputType, PickType } from '@nestjs/graphql';
import { UserCreateInput } from '../../@generated';
import {
  RegistrationInputData,
  RegistrationInput,
  LoginInput,
} from './interfaces';

@InputType()
class RegistrationInputType
  extends PickType(UserCreateInput, ['email', 'firstName', 'lastName'])
  implements RegistrationInputData
{
  @Field()
  password: string;
}

@ArgsType()
export class RegistrationArgs implements RegistrationInput {
  @Field(() => RegistrationInputType, { nullable: false })
  data: RegistrationInputType;
}

@ArgsType()
export class LoginArgs implements LoginInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;
}

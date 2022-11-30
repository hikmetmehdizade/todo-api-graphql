import { Prisma } from '@prisma/client';
import { User } from '../../../types';

export interface RegistrationInputData
  extends Pick<Prisma.UserCreateInput, 'email' | 'firstName' | 'lastName'> {
  password: string;
}

export interface RegistrationInput {
  data: RegistrationInputData;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegistrationData {
  registration: User;
}

export interface LoginData {
  login: User;
}

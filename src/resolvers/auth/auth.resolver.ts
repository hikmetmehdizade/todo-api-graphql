import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { Response } from 'express';
import { AuthCookies } from 'src/consts';
import { Public } from 'src/decorators';
import { PrismaService } from 'src/prisma.service';
import { User } from '../../../prisma/generated/types';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    readonly prisma: PrismaService,
    private authService: AuthService,
  ) {}

  @Mutation(() => User)
  @Public()
  async logIn(
    @Context() context: GraphQLExecutionContext & { res: Response },
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user.email,
      user.currentWorkspaceId,
    );

    context.res
      .cookie(AuthCookies.ACCESS_TOKEN, accessToken)
      .cookie(AuthCookies.REFRESH_TOKEN, refreshToken);

    return user;
  }
}

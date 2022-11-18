import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../../../prisma/generated/types';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthCookies } from 'src/consts';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    readonly prisma: PrismaService,
    private authService: AuthService,
  ) {}

  @Mutation(() => User)
  async logIn(
    @Context() context: GraphQLExecutionContext,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const userIdentity = await this.prisma.userIdentity.findUnique({
      where: {
        email,
      },
    });

    if (!userIdentity) {
      throw new NotFoundException(`User with ${email} not found`);
    }

    if (!this.authService.verifyPassword(password, userIdentity.password)) {
      throw new BadRequestException('Wrong password');
    }
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const { accessToken, refreshToken } = this.authService.generateTokens(
      user.email,
      user.currentWorkspaceId,
    );

    // @ts-ignore
    context.res
      .cookie(AuthCookies.ACCESS_TOKEN, accessToken)
      .cookie(AuthCookies.REFRESH_TOKEN, refreshToken);

    return user;
  }
}

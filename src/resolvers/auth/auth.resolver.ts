import { ForbiddenException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthCookies } from 'src/consts';
import { CurrentUser, Public } from 'src/decorators';
import { PrismaService } from 'src/prisma.service';
import { Ctx } from 'src/types';
import { User } from '../../@generated';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginArgs, RegistrationArgs } from './auth.args';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    readonly prisma: PrismaService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => User, { name: 'login' })
  @Public()
  async login(@Context() context: Ctx, @Args() loginArgs: LoginArgs) {
    const { email, password } = loginArgs;
    const user = await this.authService.validateUser(email, password);

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user.email,
    );

    context.res
      .cookie(AuthCookies.ACCESS_TOKEN, accessToken)
      .cookie(AuthCookies.REFRESH_TOKEN, refreshToken);

    return user;
  }

  @Mutation(() => User, { name: 'registration' })
  @Public()
  async registration(
    @Context() context: Ctx,
    @Args() registrationArgs: RegistrationArgs,
  ) {
    const { password, email, firstName, lastName } = registrationArgs.data;

    const isExists = await this.userService.ensureUserIsExists(email);
    if (isExists) {
      throw new ForbiddenException('User is exists');
    }

    const hashedPassword = this.authService.hashPassword(password);
    const [user] = await this.prisma.$transaction([
      this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
        },
      }),
      this.prisma.userIdentity.create({
        data: {
          email,
          password: hashedPassword,
        },
      }),
    ]);
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user.email,
    );
    context.res
      .cookie(AuthCookies.ACCESS_TOKEN, accessToken)
      .cookie(AuthCookies.REFRESH_TOKEN, refreshToken);

    return user;
  }

  @Mutation(() => Boolean, { name: 'logout' })
  async logout(@Context() context: Ctx, @CurrentUser() user: User) {
    await this.prisma.userIdentity.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        refreshToken: null,
      },
    });

    context.res
      .clearCookie(AuthCookies.ACCESS_TOKEN)
      .clearCookie(AuthCookies.REFRESH_TOKEN);

    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CookiesToken, DecoratorKeys } from 'src/consts';
import { AuthService } from 'src/resolvers/auth/auth.service';
import { Ctx } from 'src/types';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      DecoratorKeys.IS_PUBLIC,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { cookies } = ctx.getContext<Ctx>().req;
    const { auth_access_token, auth_refresh_token } =
      cookies as Partial<CookiesToken>;

    const at = this.authService.verifyToken(auth_access_token);

    const rt = this.authService.verifyToken(auth_refresh_token);

    if (typeof at !== 'undefined') {
      return true;
    }

    if (typeof rt !== 'undefined') {
      return true;
    }

    return false;
  }
}

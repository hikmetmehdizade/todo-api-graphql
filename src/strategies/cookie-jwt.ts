import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CookiesToken, JWT_SECRET_KEY } from 'src/consts';
import { PrismaService } from 'src/prisma.service';
import { TokenPayload } from 'src/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'cookie-jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: JWT_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request) {
    const cookies = req.cookies as Partial<CookiesToken>;

    if (cookies.auth_access_token) {
      return cookies.auth_access_token;
    }
    return null;
  }

  async validate(req: Request, payload: TokenPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (user) {
      return user;
    }
    return null;
  }
}

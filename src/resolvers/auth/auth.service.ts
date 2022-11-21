import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookiesToken } from 'src/consts';
import { PrismaService } from 'src/prisma.service';
import { TokenPayload } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const [user, userIdentity] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          email,
        },
      }),
      this.prisma.userIdentity.findUnique({
        where: {
          email,
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException(`User with ${email} not found`);
    }

    if (!this.verifyPassword(password, userIdentity.password)) {
      throw new BadRequestException('Wrong password');
    }

    return user;
  }

  async generateTokens(email: string, workspaceId: string = undefined) {
    const payload: TokenPayload = { email, workspaceId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.prisma.userIdentity.update({
      where: {
        email,
      },
      data: {
        refreshToken,
      },
    });

    if (workspaceId) {
      this.prisma.user.update({
        where: {
          email,
        },
        data: {
          currentWorkspace: {
            connect: {
              uuid: workspaceId,
            },
          },
        },
      });
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  hashPassword(password: string) {
    const p = this.jwtService.sign(password);
    return p;
  }

  async verifyPassword(password: string, hashedPassword: string) {
    const p = this.jwtService.verify(hashedPassword);

    return password === p;
  }

  verifyToken(token?: string): TokenPayload | undefined {
    if (typeof token !== 'undefined') {
      try {
        const verifiedToken = this.jwtService.verify<TokenPayload>(token, {
          complete: true,
        });

        return verifiedToken;
      } catch (err) {
        return;
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  generateTokens(email: string, workspaceId?: string) {
    const payload: TokenPayload = { email, workspaceId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
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

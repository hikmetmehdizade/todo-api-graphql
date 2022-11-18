import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { JWT_SECRET_KEY } from 'src/consts';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET_KEY,
    }),
  ],
  providers: [AuthService, PrismaService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}

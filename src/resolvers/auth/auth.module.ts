import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET_KEY } from 'src/consts';
import { GqlAuthGuard } from 'src/guards/auth';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from 'src/strategies/jwt-strategy';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      session: false,
    }),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    AuthResolver,
    UserService,
    GqlAuthGuard,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

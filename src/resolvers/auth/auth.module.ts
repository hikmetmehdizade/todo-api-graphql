import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from 'src/consts';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
    }),
  ],
  providers: [AuthService, PrismaService, AuthResolver, UserService],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from 'src/consts';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
    }),
  ],
  providers: [PrismaService, UserResolver, AuthService, UserService],
})
export class UserModule {}

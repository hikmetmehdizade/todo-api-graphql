import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [PrismaService, UserResolver, JwtService, AuthService],
})
export class UserModule {}

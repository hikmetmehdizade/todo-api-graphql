import { Module } from '@nestjs/common';
import { WorkspaceResolver } from './workspace.resolver';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [WorkspaceResolver, PrismaService, AuthService, JwtService],
})
export class WorkspaceModule {}

import { Module } from '@nestjs/common';
import { WorkspaceResolver } from './workspace.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  providers: [WorkspaceResolver, PrismaService],
})
export class WorkspaceModule {}

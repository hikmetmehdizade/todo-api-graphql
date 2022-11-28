import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { WorkspaceTaskStatusResolver } from './workspace-task-status.resolver';

@Module({
  providers: [WorkspaceTaskStatusResolver, WorkspaceService, PrismaService],
})
export class WorkspaceTaskStatusModule {}

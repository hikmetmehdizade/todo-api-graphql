import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Module({
  providers: [WorkspaceService, PrismaService],
})
export class WorkspaceTaskStatusModule {}

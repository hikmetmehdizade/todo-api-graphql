import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WorkspaceMemberResolver } from './workspace-member.resolver';

@Module({
  providers: [WorkspaceMemberResolver, PrismaService],
})
export class WorkspaceMemberModule {}

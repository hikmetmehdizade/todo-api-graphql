import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskResolver } from './task.resolver';

@Module({
  providers: [TaskResolver, PrismaService],
})
export class TaskModule {}

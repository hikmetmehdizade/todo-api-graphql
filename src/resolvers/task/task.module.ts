import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/consts';
import { PrismaService } from 'src/prisma.service';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  providers: [
    TaskResolver,
    PrismaService,
    TaskService,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
})
export class TaskModule {}

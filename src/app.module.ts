import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { WorkspaceModule } from './workspace/workspace.module';
import { PrismaService } from './prisma.service';
import { join } from 'path';
import { TaskModule } from './task/task.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { AssignedMemberModule } from './assigned-member/assigned-member.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    WorkspaceModule,
    TaskModule,
    WorkspaceMemberModule,
    AssignedMemberModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

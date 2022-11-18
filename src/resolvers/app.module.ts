import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { WorkspaceModule } from './workspace/workspace.module';
import { PrismaService } from '../prisma.service';
import { join } from 'path';
import { TaskModule } from './task/task.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { AssignedMemberModule } from './assigned-member/assigned-member.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
    }),
    WorkspaceModule,
    TaskModule,
    WorkspaceMemberModule,
    AssignedMemberModule,
    AuthModule,
    UserModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GqlAuthGuard } from 'src/guards/auth';
import { LoggingInterceptor } from 'src/interceptors/logging';
import { JwtStrategy } from 'src/strategies/cookie-jwt';
import { PrismaService } from '../prisma.service';
import { AssignedMemberModule } from './assigned-member/assigned-member.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { WorkspaceTaskStatusModule } from './workspace-task-status/workspace-task-status.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res, next }) => ({ req, res, next }),
    }),
    WorkspaceModule,
    TaskModule,
    WorkspaceMemberModule,
    AssignedMemberModule,
    AuthModule,
    UserModule,
    WorkspaceTaskStatusModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
    PrismaService,
    JwtStrategy,
  ],
})
export class AppModule {}

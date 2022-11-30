import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, UnauthorizedException } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Context } from 'graphql-ws';
import { join } from 'path';
import { GqlAuthGuard } from 'src/guards/auth';
import { LoggingInterceptor } from 'src/interceptors/logging';
import { JwtStrategy } from 'src/strategies/cookie-jwt';
import { PrismaService } from './prisma.service';
import { AssignedMemberModule } from './resolvers/assigned-member/assigned-member.module';
import { AuthModule } from './resolvers/auth/auth.module';
import { TaskModule } from './resolvers/task/task.module';
import { UserModule } from './resolvers/user/user.module';
import { WorkspaceMemberModule } from './resolvers/workspace-member/workspace-member.module';
import { WorkspaceTaskStatusModule } from './resolvers/workspace-task-status/workspace-task-status.module';
import { WorkspaceModule } from './resolvers/workspace/workspace.module';
import { PubSub } from 'graphql-subscriptions';
import { CookiesToken } from 'src/consts';
import { TokenPayload } from 'src/types';
import { AuthService } from './resolvers/auth/auth.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: async (authService: AuthService) => ({
        playground: {
          settings: {
            'request.credentials': 'include',
          },
        },
        subscriptions: {
          'graphql-ws': {
            path: '/graphql',
            onConnect: (context: Context<Partial<CookiesToken>>) => {
              const { connectionParams } = context;

              let tokenPayload: TokenPayload | undefined = undefined;

              if (connectionParams.auth_access_token) {
                tokenPayload = authService.verifyToken(
                  connectionParams.auth_access_token,
                );
              }

              if (typeof tokenPayload !== 'undefined') {
                return { email: tokenPayload.email };
              }

              throw new UnauthorizedException('Auth not provided');
            },
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
      provide: 'PUB_SUB',
      useValue: new PubSub(),
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

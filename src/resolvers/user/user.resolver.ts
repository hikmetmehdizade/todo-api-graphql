import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User, Workspace } from 'prisma/generated/types';
import { CurrentUser } from '../../decorators';
import { PrismaService } from '../../prisma.service';

@Resolver(() => User)
export class UserResolver {
  constructor(readonly prisma: PrismaService) {}

  @Query(() => User, { name: 'me' })
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField(() => Workspace)
  currentWorkspace(@Parent() user: User) {
    return this.prisma.user
      .findUnique({
        where: {
          uuid: user.uuid,
        },
      })
      .currentWorkspace();
  }
}

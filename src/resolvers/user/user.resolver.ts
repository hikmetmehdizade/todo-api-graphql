import { Query, Resolver } from '@nestjs/graphql';
import { User } from 'prisma/generated/types';
import { PrismaService } from 'src/prisma.service';

@Resolver(() => User)
export class UserResolver {
  constructor(readonly prisma: PrismaService) {}

  @Query(() => User, { name: 'me' })
  getMe() {
    return this.prisma.user.findFirst();
  }
}

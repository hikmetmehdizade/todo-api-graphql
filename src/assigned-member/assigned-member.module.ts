import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AssignedMemberResolver } from './assigned-member.resolver';

@Module({
  providers: [AssignedMemberResolver, PrismaService],
})
export class AssignedMemberModule {}

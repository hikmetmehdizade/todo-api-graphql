import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService) {}

  async ensureUserIsExists(email: string) {
    const count = await this.prisma.user.count({
      where: {
        email,
      },
    });

    return count === 1;
  }
}

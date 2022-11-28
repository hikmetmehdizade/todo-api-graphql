import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async getFirstTaskStatus(workspaceId: string) {
    return this.prisma.workspaceTaskStatus.findFirst({
      where: {
        workspace: {
          uuid: workspaceId,
        },
      },
      orderBy: { order: 'asc' },
    });
  }
}

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(readonly prisma: PrismaService) {}

  async ensureUserIsWorkspaceMember(email: string, workspaceId: string) {
    const count = await this.prisma.workspaceMember.count({
      where: {
        user: {
          email,
        },
        workspace: {
          uuid: workspaceId,
        },
      },
    });

    if (count === 0) {
      throw new ForbiddenException('User is not workspace member');
    }
  }
}

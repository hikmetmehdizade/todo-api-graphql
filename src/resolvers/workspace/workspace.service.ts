import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

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

  async ensureUserIsWorkspaceOwner(workspaceId: string, userId: string) {
    const count = await this.prisma.workspaceMember.count({
      where: {
        workspaceId,
        user: {
          uuid: userId,
        },
        role: 'OWNER',
      },
    });

    if (count === 0) {
      throw new ForbiddenException('User is not workspace owner');
    }
  }

  async ensureUserIsWorkspaceOwnerOrAdmin(workspaceId: string, userId: string) {
    const count = await this.prisma.workspaceMember.count({
      where: {
        workspaceId,
        userId,
        role: {
          in: ['ADMIN', 'OWNER'],
        },
      },
    });

    if (count === 0) {
      throw new ForbiddenException('User is not workspace owner or admin');
    }
  }
}

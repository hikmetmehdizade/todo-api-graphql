import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WorkspaceMemberRole } from '@prisma/client';
import { DecoratorKeys } from 'src/consts/decorators-key';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WorkspaceRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<
      WorkspaceMemberRole[]
    >(DecoratorKeys.ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    if (user.currentWorkspaceId !== null) {
      const count = await this.prisma.workspaceMember.count({
        where: {
          workspaceId: user.currentWorkspaceId,
          userId: user.uuid,
          role: {
            in: requiredRoles,
          },
        },
      });

      return count === 1;
    }
    return false;
  }
}

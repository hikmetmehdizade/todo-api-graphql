import { SetMetadata } from '@nestjs/common';
import { WorkspaceMemberRole } from 'prisma/generated/types';
import { DecoratorKeys } from 'src/consts';

const WorkspaceMemberRoles = (...roles: WorkspaceMemberRole[]) =>
  SetMetadata(DecoratorKeys.ROLES_KEY, roles);

export default WorkspaceMemberRoles;

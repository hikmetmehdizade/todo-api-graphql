import { SetMetadata } from '@nestjs/common';
import { WorkspaceMemberRole } from '../@generated';
import { DecoratorKeys } from '../consts';

const WorkspaceMemberRoles = (...roles: WorkspaceMemberRole[]) =>
  SetMetadata(DecoratorKeys.ROLES_KEY, roles);

export default WorkspaceMemberRoles;

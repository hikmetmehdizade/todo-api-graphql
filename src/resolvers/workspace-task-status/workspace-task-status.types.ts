import { PickType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

export interface CreateWorkspaceTaskStatusInput {
  data: Pick<Prisma.WorkspaceTaskStatusCreateInput, 'title'>;
}

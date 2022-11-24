import { Request, Response } from 'express';
import { User } from 'prisma/generated/types';

export interface Ctx {
  req: Request;
  res: Response;
  user: User;
  workspaceId?: string;
}

export class TokenPayload {
  email: string;
  workspaceId?: string;
}

import { Request, Response } from 'express';
import { User } from './models';

export interface Ctx {
  req: Request;
  res: Response;
  user: User;
}

export interface TokenPayload {
  email: string;
}

export interface MutationPayload {
  _count: number;
}
export interface PaginationType {
  skip?: number;
  take?: number;
}

export enum SubscriptionAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface SubDeletePayload {
  deletedId: string;
}

export interface SubscriptionPayloadType<T = any> {
  payload: T | SubDeletePayload;
  action: SubscriptionAction;
}

export * from './models';
export * from '../resolvers/workspace-task-status/interfaces';
export * from '../resolvers/workspace/interfaces';
export * from '../resolvers/workspace-member/interfaces';
export * from '../resolvers/assigned-member/interfaces';
export * from '../resolvers/task/interfaces';
export * from '../resolvers/auth/interfaces';
export * from '../resolvers/user/interfaces';

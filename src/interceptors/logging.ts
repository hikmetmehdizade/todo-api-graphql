import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);

    console.log('Before:', ctx.getInfo().fieldName);

    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`After: ${Date.now() - now}ms`)));
  }
}

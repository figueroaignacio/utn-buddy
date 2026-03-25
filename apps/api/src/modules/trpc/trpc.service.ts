import { Injectable } from '@nestjs/common';
import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import { Request, Response } from 'express';

import { TrpcContext as SharedTrpcContext } from '@repo/trpc';

export interface TrpcContext extends SharedTrpcContext {
  req: Request;
  res: Response;
}

@Injectable()
export class TrpcService {
  public readonly t = initTRPC.context<TrpcContext>().create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

  public readonly router = this.t.router;
  public readonly procedure = this.t.procedure;

  public readonly authenticatedProcedure = this.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}

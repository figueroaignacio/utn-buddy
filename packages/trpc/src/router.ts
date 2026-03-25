import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { User, Conversation, ConversationWithMessages } from './schemas';

export interface TrpcContext {
  req: any;
  res: any;
  user?: {
    id: string;
    username: string;
  };
}

const t = initTRPC.context<TrpcContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const authenticatedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const appRouter = router({
  health: publicProcedure.query(() => ({ status: 'ok', timestamp: new Date().toISOString() })),
  auth: router({
    status: publicProcedure.query(() => ({} as { authenticated: boolean; user: User | null })),
    logout: authenticatedProcedure.mutation(() => ({} as { success: boolean })),
  }),
  users: router({
    getMe: authenticatedProcedure.query(() => ({} as User)),
    findAll: authenticatedProcedure.query(() => [] as User[]),
    findOne: authenticatedProcedure.input(z.object({ id: z.string() })).query(() => ({} as User)),
  }),
  conversations: router({
    list: authenticatedProcedure.query(() => [] as Conversation[]),
    get: authenticatedProcedure
      .input(z.object({ id: z.string() }))
      .query(() => ({} as ConversationWithMessages)),
    create: authenticatedProcedure
      .input(z.object({ title: z.string().optional() }))
      .mutation(() => ({} as Conversation)),
    delete: authenticatedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(() => ({} as { success: boolean })),
  }),
});

export type AppRouter = typeof appRouter;
export * from './schemas';

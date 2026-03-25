import { Injectable } from '@nestjs/common';
import type { AppRouter } from '@repo/trpc';
import { z } from 'zod';
import { AuthService } from '../auth/auth.service';
import { ConversationsService } from '../conversations/conversations.service';
import { UsersService } from '../users/users.service';
import { TrpcService } from './trpc.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrpcRouter {
  public readonly appRouter: AppRouter;

  constructor(
    private readonly trpc: TrpcService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly conversationsService: ConversationsService,
    private readonly configService: ConfigService,
  ) {
    this.appRouter = this.trpc.router({
      health: this.trpc.procedure.query(() => {
        return { status: 'ok', timestamp: new Date().toISOString() };
      }),
      auth: this.trpc.router({
        status: this.trpc.procedure.query(({ ctx }) => {
          return {
            authenticated: !!ctx.user,
            user: ctx.user || null,
          };
        }),
        logout: this.trpc.authenticatedProcedure.mutation(async ({ ctx }) => {
          await this.authService.logout(ctx.user.id);

          const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
          const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? ('strict' as const) : ('lax' as const),
            domain: this.configService.get<string>('COOKIE_DOMAIN'),
            path: '/',
          };

          ctx.res.clearCookie('access_token', cookieOptions);
          ctx.res.clearCookie('refresh_token', cookieOptions);

          return { success: true };
        }),
      }),
      users: this.trpc.router({
        getMe: this.trpc.authenticatedProcedure.query(async ({ ctx }) => {
          return this.usersService.findOne(ctx.user.id);
        }),
        findAll: this.trpc.authenticatedProcedure.query(async () => {
          return this.usersService.findAll();
        }),
        findOne: this.trpc.authenticatedProcedure
          .input(z.object({ id: z.string() }))
          .query(async ({ input }) => {
            return this.usersService.findOne(input.id);
          }),
      }),
      conversations: this.trpc.router({
        list: this.trpc.authenticatedProcedure.query(async ({ ctx }) => {
          return this.conversationsService.findAllByUser(ctx.user.id);
        }),
        get: this.trpc.authenticatedProcedure
          .input(z.object({ id: z.string() }))
          .query(async ({ ctx, input }) => {
            return this.conversationsService.findOne(input.id, ctx.user.id);
          }),
        create: this.trpc.authenticatedProcedure
          .input(z.object({ title: z.string().optional() }))
          .mutation(async ({ ctx, input }) => {
            return this.conversationsService.create(ctx.user.id, input);
          }),
        delete: this.trpc.authenticatedProcedure
          .input(z.object({ id: z.string() }))
          .mutation(async ({ ctx, input }) => {
            await this.conversationsService.remove(input.id, ctx.user.id);
            return { success: true };
          }),
      }),
    });
  }
}

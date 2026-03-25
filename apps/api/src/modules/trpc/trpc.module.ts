import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';
import { TrpcRouter } from './trpc.router';
import { TrpcService } from './trpc.service';

@Module({
  imports: [UsersModule, AuthModule, ConversationsModule],
  providers: [TrpcService, TrpcRouter],
  exports: [TrpcRouter],
})
export class TrpcModule {}

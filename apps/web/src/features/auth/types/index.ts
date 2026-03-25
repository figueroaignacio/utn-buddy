import { User as TrpcUser } from '@repo/trpc';

export type User = TrpcUser;

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

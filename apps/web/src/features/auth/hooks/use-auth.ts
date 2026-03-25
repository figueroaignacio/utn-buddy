import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { loginWithGoogle as apiLoginWithGoogle } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { trpc } from '@/lib/trpc';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, status, setUser, setStatus, clearAuth } = useAuthStore();

  const { data: statusData, isLoading: isStatusLoading } = trpc.auth.status.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const { data: currentUser, isLoading: isAuthLoading } = trpc.users.getMe.useQuery(undefined, {
    staleTime: Infinity,
    enabled: !!statusData?.authenticated,
  });

  // Handle side effects for state management
  useEffect(() => {
    if (statusData && !isStatusLoading) {
      if (statusData.authenticated && statusData.user && !user) {
        setUser(statusData.user);
      } else if (!statusData.authenticated && status === 'authenticated') {
        clearAuth();
      }
    }
  }, [statusData, isStatusLoading, user, status, setUser, clearAuth]);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      clearAuth();
      queryClient.setQueryData(['auth-user'], null);
      window.location.href = '/';
    },
  });

  const login = useCallback(() => {
    window.location.href = `${API_URL}/api/auth/github`;
  }, []);

  const loginWithGoogle = useCallback(() => {
    apiLoginWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    setStatus('loading', 'Signing out...');
    await logoutMutation.mutateAsync();
  }, [logoutMutation, setStatus]);

  return {
    user: currentUser ?? user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || isAuthLoading || logoutMutation.isPending,
    login,
    loginWithGoogle,
    logout,
    setUser,
  };
}

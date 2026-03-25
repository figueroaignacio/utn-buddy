import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { trpc } from '@/lib/trpc';

export function useConversations() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: conversations = [], isLoading } = trpc.conversations.list.useQuery();

  const createMutation = trpc.conversations.create.useMutation({
    onSuccess: conversation => {
      utils.conversations.list.setData(undefined, (old = []) => [conversation, ...old]);
      router.push(`/chat/c/${conversation.id}`);
    },
  });

  const deleteMutation = trpc.conversations.delete.useMutation({
    onSuccess: (_, { id }) => {
      utils.conversations.list.setData(undefined, (old = []) => old.filter(c => c.id !== id));
      router.push('/chat');
    },
  });

  const createConversation = useCallback(async () => {
    return createMutation.mutateAsync({ title: undefined });
  }, [createMutation]);

  const deleteConversation = useCallback(
    async (id: string) => {
      return deleteMutation.mutateAsync({ id });
    },
    [deleteMutation],
  );

  return {
    conversations,
    isLoading: isLoading || createMutation.isPending,
    createConversation,
    deleteConversation,
  };
}

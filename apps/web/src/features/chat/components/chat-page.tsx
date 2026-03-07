'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { createConversation } from '../api/conversations.api';
import { usePendingPromptStore } from '../store/pending-prompt.store';
import type { Conversation } from '../types';
import { ChatHero } from './chat-hero';
import { ChatInput } from './chat-input';
import { ChatSuggestions } from './chat-suggestions';

export function ChatPage() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();
  const setPendingPrompt = usePendingPromptStore(s => s.setPendingPrompt);

  const startChatMutation = useMutation({
    mutationFn: async () => {
      const conversation = await createConversation();
      queryClient.setQueryData<Conversation[]>(['conversations'], old =>
        old ? [conversation, ...old] : [conversation],
      );
      return conversation;
    },
    onSuccess: conversation => {
      setPendingPrompt(input.trim());
      router.push(`/chat/c/${conversation.id}`);
    },
  });

  const handleSubmit = useCallback(async () => {
    const content = input.trim();
    if (!content || startChatMutation.isPending) return;
    startChatMutation.mutate();
  }, [input, startChatMutation]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full gap-8 py-16 px-4">
          {user && <ChatHero username={user.username} />}
          <div className="w-full max-w-2xl">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={startChatMutation.isPending}
            />
          </div>
          <ChatSuggestions onSelect={setInput} />
        </div>
      </div>
    </div>
  );
}

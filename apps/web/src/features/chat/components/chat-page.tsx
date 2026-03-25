'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCallback, useState } from 'react';
import { useConversations } from '../hooks/use-conversations';
import { usePendingPromptStore } from '../store/pending-prompt.store';
import { ChatHero } from './chat-hero';
import { ChatInput } from './chat-input';
import { ChatSuggestions } from './chat-suggestions';

export function ChatPage() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const { createConversation, isLoading: isCreating } = useConversations();
  const setPendingPrompt = usePendingPromptStore(s => s.setPendingPrompt);

  const handleSubmit = useCallback(async () => {
    const content = input.trim();
    if (!content || isCreating) return;

    try {
      setPendingPrompt(content);
      await createConversation();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  }, [input, isCreating, createConversation, setPendingPrompt]);

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
              isLoading={isCreating}
            />
          </div>
          <ChatSuggestions onSelect={setInput} />
        </div>
      </div>
    </div>
  );
}

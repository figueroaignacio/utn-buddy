'use client';

import { trpc } from '@/lib/trpc';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { usePendingPromptStore } from '../store/pending-prompt.store';
import type { Message } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function useConversation(conversationId: string) {
  const utils = trpc.useUtils();
  const hasLoadedRef = useRef(false);
  const hasInitialSentRef = useRef(false);
  const consumePendingPrompt = usePendingPromptStore(s => s.consumePendingPrompt);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${API_URL}/api/conversations/${conversationId}/stream`,
        credentials: 'include',
      }),
    [conversationId],
  );

  const {
    messages: aiMessages,
    status,
    sendMessage: sendAIMessage,
    setMessages,
    stop,
  } = useChat({
    id: conversationId,
    transport,
  });

  const messages: Message[] = useMemo(() => {
    return aiMessages.map(m => {
      const content = m.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map(p => p.text ?? '')
        .join('');

      return {
        id: m.id,
        role: m.role as Message['role'],
        content,
        conversationId,
        createdAt: new Date().toISOString(),
      };
    });
  }, [aiMessages, conversationId]);

  const { data: conversation, isLoading: isInitialLoading } = trpc.conversations.get.useQuery(
    { id: conversationId },
    { enabled: !!conversationId },
  );

  useEffect(() => {
    const pendingPrompt = consumePendingPrompt();
    if (pendingPrompt && !hasInitialSentRef.current) {
      hasInitialSentRef.current = true;
      sendAIMessage({ text: pendingPrompt });
    }

    if (!conversation) return;

    if (conversation.title) {
      utils.conversations.list.setData(undefined, old =>
        old?.map(c => (c.id === conversation.id ? { ...c, title: conversation.title! } : c)),
      );
    }

    if (conversation.messages?.length > 0 && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      const uiMessages = conversation.messages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        parts: [{ type: 'text' as const, text: msg.content }],
      }));

      setMessages(uiMessages);
    }
  }, [conversation, setMessages, consumePendingPrompt, sendAIMessage, utils.conversations.list]);

  useEffect(() => {
    if (status === 'ready' && aiMessages.length > 0) {
      utils.conversations.list.invalidate();
    }
  }, [status, aiMessages.length, utils.conversations.list]);

  const isLoading = status === 'streaming' || status === 'submitted';
  const isStreaming = status === 'streaming';

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;
      await sendAIMessage({ text: content.trim() });
    },
    [isLoading, sendAIMessage],
  );

  return {
    messages,
    isLoading,
    isInitialLoading,
    isStreaming,
    sendMessage,
    stop,
  };
}

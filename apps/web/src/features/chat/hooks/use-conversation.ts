'use client';

import { useChat } from '@ai-sdk/react';
import { useQueryClient } from '@tanstack/react-query';
import { DefaultChatTransport } from 'ai';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { getConversation } from '../api/conversations.api';
import type { Conversation, Message } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function useConversation(conversationId: string) {
  const queryClient = useQueryClient();
  const hasLoadedRef = useRef(false);
  const hasAutoSentRef = useRef(false);

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

  useEffect(() => {
    if (!conversationId || hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    getConversation(conversationId).then(conversation => {
      if (conversation.title) {
        queryClient.setQueryData<Conversation[]>(['conversations'], old =>
          old?.map(c => (c.id === conversation.id ? { ...c, title: conversation.title! } : c)),
        );
      }

      if (conversation.messages?.length > 0) {
        const uiMessages = conversation.messages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          parts: [{ type: 'text' as const, text: msg.content }],
        }));

        setMessages(uiMessages);

        const lastMsg = conversation.messages[conversation.messages.length - 1];
        if (lastMsg.role === 'user' && !hasAutoSentRef.current) {
          hasAutoSentRef.current = true;
          setTimeout(() => {
            sendAIMessage();
          }, 100);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (status === 'ready' && aiMessages.length > 0) {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  }, [status, aiMessages.length, queryClient]);

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
    isStreaming,
    sendMessage,
    stop,
  };
}

'use client';

import { cn } from '@repo/ui/lib/cn';
import { MarkdownRenderer } from './markdown-renderer';
import type { UIMessage } from '@ai-sdk/react';

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const content = message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join('');

  return (
    <div className={cn('flex gap-3 w-full items-start', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-full rounded-2xl text-sm leading-relaxed relative transition-all duration-300',
          isUser
            ? 'bg-card rounded-tr-sm px-4 py-2.5 shadow-sm ring-1 ring-border/50 w-fit'
            : 'text-foreground px-0',
        )}
      >
        <MarkdownRenderer content={content} isStreaming={isStreaming} />
      </div>
    </div>
  );
}

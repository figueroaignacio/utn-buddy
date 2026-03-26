import { useArtifactStore } from '@/features/chat/store/artifact.store';
import { type SafePart } from '@/features/chat/types';
import type { UIMessage } from '@ai-sdk/react';
import { cn } from '@repo/ui/lib/cn';
import { memo } from 'react';
import { MessagePartRenderer } from './message-part-renderer';

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export const ChatMessage = memo(({ message, isStreaming }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const openArtifact = useArtifactStore(s => s.openArtifact);

  return (
    <div className={cn('flex gap-3 w-full items-start', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-full rounded-2xl text-sm leading-relaxed relative transition-all duration-300',
          isUser
            ? 'bg-secondary rounded-tr-sm px-4 py-2.5 shadow-sm ring-1 ring-border/50 w-fit'
            : 'text-foreground px-0 w-full',
        )}
      >
        <div className="flex flex-col gap-4">
          {message.parts.map((item, index) => (
            <div key={`${message.id}-part-${index}`}>
              <MessagePartRenderer
                part={item as SafePart}
                messageId={message.id}
                index={index}
                isStreaming={!!(isStreaming && index === message.parts.length - 1)}
                onOpenArtifact={openArtifact}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

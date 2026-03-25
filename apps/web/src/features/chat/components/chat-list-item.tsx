'use client';

import { Calendar01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { Dialog } from '@repo/ui/components/dialog';
import Link from 'next/link';
import type { Conversation } from '../types';

interface ChatListItemProps {
  chat: Conversation;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function ChatListItem({ chat, onDelete, isDeleting }: ChatListItemProps) {
  return (
    <div className="group relative flex items-center justify-between py-4 transition-colors hover:bg-muted/30 -mx-4 px-4 ">
      <Link href={`/chat/c/${chat.id}`} className="flex-1 min-w-0 pr-12">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-foreground truncate  transition-colors">
            {chat.title ?? 'Untitled Conversation'}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Calendar01Icon} size={12} />
            <span>{dateFormatter.format(new Date(chat.updatedAt))}</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Dialog>
          <Dialog.Trigger asChild>
            <button
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete"
              onClick={e => e.stopPropagation()}
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </button>
          </Dialog.Trigger>
          <Dialog.Content className="max-w-md">
            <Dialog.Header>
              <Dialog.Title>Delete conversation</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to delete &quot;
                <span className="font-semibold text-foreground">
                  {chat.title ?? 'this conversation'}
                </span>
                &quot;?
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer className="mt-4">
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(chat.id)}
                loading={isDeleting}
              >
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    </div>
  );
}

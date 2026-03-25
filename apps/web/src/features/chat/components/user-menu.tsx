'use client';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  HelpCircleIcon,
  Logout01Icon,
  Moon02Icon,
  UserCircle02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { DropdownMenu } from '@repo/ui/components/dropdown-menu';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const initials = user.username
    .split(/[\s_-]/)
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2 ring-border hover:ring-primary/50 transition-all focus:outline-none"
          aria-label="User menu"
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.username}
              width={32}
              height={32}
              className="rounded-full object-cover size-8"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {initials}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" sideOffset={10} className="w-72 rounded-xl">
        <div className="px-2 py-1.5 text-sm font-medium leading-none">
          <div className="flex items-center gap-2">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.username}
                width={32}
                height={32}
                className="rounded-full object-cover size-8"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {initials}
              </span>
            )}
            <div className="flex flex-col">
              {user.username}
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </div>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => router.push('/profile')}>
          <HugeiconsIcon
            icon={UserCircle02Icon}
            size={15}
            className="mr-2.5 shrink-0 text-muted-foreground"
          />
          Profile
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <HugeiconsIcon
            icon={HelpCircleIcon}
            size={15}
            className="mr-2.5 shrink-0 text-muted-foreground"
          />
          Help
        </DropdownMenu.Item>
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center">
            <HugeiconsIcon
              icon={Moon02Icon}
              size={15}
              className="mr-2.5 shrink-0 text-muted-foreground"
            />
            <span className="text-sm">Theme</span>
          </div>
          <ThemeToggle />
        </div>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive" onSelect={logout}>
          <HugeiconsIcon icon={Logout01Icon} size={15} className="mr-2.5 shrink-0" />
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

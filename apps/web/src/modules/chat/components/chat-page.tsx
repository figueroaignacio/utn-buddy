"use client";

import { useAuth } from "@/modules/auth/hooks/use-auth";
import { useRouter } from "@tanstack/react-router";

export function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.navigate({ to: "/" });
    return null;
  }

  return (
    <div>
      <h1>Chat</h1>
      <img src={user.avatar_url} alt={user?.username} />
      <p>{user?.email}</p>
      <p>{user?.username}</p>
    </div>
  );
}

import { useAuth } from "@/modules/auth/hooks/use-auth";
import { useRouter } from "@tanstack/react-router";
import { ChatPromptBox } from "./chat-prompt-box";

export function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    router.navigate({ to: "/" });
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 min-h-lvh">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            What can I help you with?
          </h1>
        </div>
        <ChatPromptBox />
      </div>
    </div>
  );
}

import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useSidebar } from "@/shared/store/use-sidebar";
import { Link } from "@tanstack/react-router";
import { useConversations } from "../hooks/use-conversations";

interface Conversation {
  id: string;
  title: string | null;
}

export function SidebarRecents() {
  const { isOpen } = useSidebar();
  const isMobile = useIsMobile();
  const openStyle = isOpen || isMobile;

  const { data: conversations, isLoading, isError } = useConversations();

  if (!openStyle) return null;

  if (isError)
    return (
      <div className="flex-1 flex flex-col min-h-0 w-[266px]">
        <h3 className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground tracking-tight">
          Recents
        </h3>
        <div className="space-y-0.5 mt-1 overflow-y-auto flex-1 pb-4">
          <div className="px-2.5 py-2 text-sm text-red-500/80">
            Error loading recents
          </div>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex-1 flex flex-col min-h-0 w-[266px]">
        <h3 className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground tracking-tight">
          Recents
        </h3>
        <div className="space-y-0.5 mt-1 overflow-y-auto flex-1 pb-4">
          <div className="px-2.5 py-2 text-sm text-muted-foreground animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    );

  if (conversations?.length === 0)
    return (
      <div className="flex-1 flex flex-col min-h-0 w-[266px]">
        <h3 className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground tracking-tight">
          Recents
        </h3>
        <div className="space-y-0.5 mt-1 overflow-y-auto flex-1 pb-4">
          <div className="px-2.5 py-2 text-sm text-muted-foreground/60 italic">
            No recent conversations
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col min-h-0 w-[266px]">
      <h3 className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground tracking-tight">
        Recents
      </h3>
      <div className="space-y-0.5 mt-1 overflow-y-auto flex-1 pb-4">
        {conversations?.map((conversation: Conversation) => (
          <Link
            key={conversation.id}
            to="/chat/c/$id"
            params={{ id: conversation.id }}
            title={conversation.title || "New Conversation"}
            className="block w-full truncate text-left rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer [&.active]:bg-muted [&.active]:text-foreground [&.active]:font-medium">
            {conversation.id || "New Conversation"}
          </Link>
        ))}
      </div>
    </div>
  );
}

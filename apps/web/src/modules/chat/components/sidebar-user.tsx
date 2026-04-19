import { LogoutButton } from "@/modules/auth/components/logout-button";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useSidebar } from "@/shared/store/use-sidebar";
import { ArrowDown01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar } from "@repo/ui/components/avatar";
import { DropdownMenu } from "@repo/ui/components/dropdown-menu";

export function SidebarUser() {
  const { user } = useAuth();
  const { isOpen } = useSidebar();
  const isMobile = useIsMobile();
  const openStyle = isOpen || isMobile;

  const username = user?.username || "";
  const userInitials = username.substring(0, 2).toUpperCase();
  const userEmail = user?.email;

  return (
    <div
      className={`p-3 border-t border-border/50 flex flex-col items-center ${openStyle ? "" : "px-0"}`}>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button
            className={`flex items-center rounded-xl p-2 hover:bg-muted transition-colors cursor-pointer group outline-none ${openStyle ? "w-[266px] justify-between" : "justify-center w-10 h-10"}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Avatar size="sm">
                <Avatar.Image src={user?.avatarUrl} />
                <Avatar.Fallback>{userInitials}</Avatar.Fallback>
              </Avatar>
              {openStyle && (
                <div className="flex flex-col items-start overflow-hidden text-left flex-1 min-w-0">
                  <span className="truncate w-full text-sm font-medium text-foreground">
                    {username}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Free plan
                  </span>
                </div>
              )}
            </div>

            {openStyle && (
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
              />
            )}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          align={openStyle ? "start" : "center"}
          className="w-[250px] mb-2 p-1">
          <div className="flex items-center gap-3 p-2 w-full">
            <Avatar size="md">
              <Avatar.Image src={user?.avatarUrl} />
              <Avatar.Fallback>{userInitials}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="truncate text-sm font-medium text-foreground">
                {username}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {userEmail}
              </span>
            </div>
          </div>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Options</DropdownMenu.Label>
          <DropdownMenu.Item className="gap-2">
            <HugeiconsIcon icon={Settings01Icon} size={16} />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <div className="px-1 py-1">
            <LogoutButton />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}

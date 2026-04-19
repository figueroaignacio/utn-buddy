import { useSidebar } from "@/shared/store/use-sidebar";
import { PanelLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function MobileHeader() {
  const { toggle } = useSidebar();

  return (
    <header className="md:hidden flex h-14 sticky top-0 z-10 items-center justify-between px-4 border-b border-border bg-card/50 backdrop-blur-md shrink-0">
      <button
        onClick={toggle}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1.5 -ml-1.5 rounded-md hover:bg-muted"
        aria-label="Toggle sidebar">
        <HugeiconsIcon icon={PanelLeftIcon} size={20} />{" "}
      </button>
      <div className="w-8" />
    </header>
  );
}

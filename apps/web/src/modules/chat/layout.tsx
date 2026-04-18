import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./components/app-sidebar";
import { MobileHeader } from "./components/mobile-header";

export function ChatLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <div className="flex-1 overflow-y-auto px-5 py-3.5 bg-card/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

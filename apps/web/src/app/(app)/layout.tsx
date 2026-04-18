import { AppSidebar } from "@/modules/chat/components/app-sidebar";
import { MobileHeader } from "@/modules/chat/components/mobile-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NachAI",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <div className="flex-1 overflow-y-auto px-5 py-3.5 bg-card/50">
          {children}
        </div>
      </div>
    </div>
  );
}

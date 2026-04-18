import { Outlet } from "@tanstack/react-router";

export function MarketingLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Outlet />
    </div>
  );
}

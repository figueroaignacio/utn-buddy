import { rootRoute } from "@/router";
import { createRoute } from "@tanstack/react-router";
import { LandingPage } from "./components/landing-page";
import { MarketingLayout } from "./layout";

export const marketingLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "marketing",
  component: MarketingLayout,
});

export const indexRoute = createRoute({
  getParentRoute: () => marketingLayoutRoute,
  path: "/",
  component: LandingPage,
});

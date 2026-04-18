import { createRootRoute, createRouter } from "@tanstack/react-router";
import {
  chatConversationRoute,
  chatLayoutRoute,
  chatNewRoute,
} from "./modules/chat/routes";
import { indexRoute, marketingLayoutRoute } from "./modules/landing/routes";

export const rootRoute = createRootRoute();

const routeTree = rootRoute.addChildren([
  marketingLayoutRoute.addChildren([indexRoute]),
  chatLayoutRoute.addChildren([chatNewRoute, chatConversationRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

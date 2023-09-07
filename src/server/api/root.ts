import { clientRouter } from "~/server/api/routers/clients";
import { createTRPCRouter } from "~/server/api/trpc";
import { activityRouter } from "./routers/activity";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  clients: clientRouter,
  activity: activityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

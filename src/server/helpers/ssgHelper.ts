import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";

export const generateSSGHelper = () =>
createServerSideHelpers({
    router: appRouter,
    ctx: { clientId: null },
    transformer: superjson, // optional - adds superjson serialization
  }); 
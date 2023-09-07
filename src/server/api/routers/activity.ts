import axios from "axios";
import { type Plan, type Activity } from "types/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
const API_URL = process.env.NEXT_PUBLIC_URL ?? ''

export const activityRouter = createTRPCRouter({
  updateActivity: publicProcedure
    .input(z.object({ clientId: z.string().min(1), activityId: z.string().min(1), note: z.string(), status: z.string() }))
    .mutation(async ({ input }): Promise<{ activity: Activity }> => {
      try {
        const {note, status, clientId, activityId} = input
        const { data: activity }: { data: Activity } = await axios.patch(`${API_URL}/client/${clientId}/activity/${activityId}`, { note, status });
        return {
          activity,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to patch activity data.");
      }
    }),

});


import axios from "axios";
import { Plan, type Client } from "types/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
const API_URL = process.env.NEXT_PUBLIC_URL ?? ''

export const clientRouter = createTRPCRouter({
  getClient: publicProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ input }): Promise<{ client: Client }> => {
      try {
        const { data: client }: { data: Client } = await axios.get(`${API_URL}/client/${input.clientId}`);
        return {
          client,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch client data.");
      }
    }),
  getClientPlan: publicProcedure
    .input(z.object({ clientId: z.string(), planId: z.string() }))
    .query(async ({ input }): Promise<{ plan: Plan }> => {
      try {
        const { data: plan }: { data: Plan } = await axios.get(`${API_URL}/client/${input.clientId}/plan/${input.planId}`);
        return {
          plan,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch client data.");
      }
    }),
});


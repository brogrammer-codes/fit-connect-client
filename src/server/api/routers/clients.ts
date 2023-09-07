import axios from "axios";
import type { Plan, Client, Activity } from "types/client";
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
  updateClientPlan: publicProcedure
    .input(z.object({ clientId: z.string().min(1), planId: z.string().min(1), note: z.string(), status: z.string() }))
    .mutation(async ({ input }): Promise<{ plan: Plan }> => {
      try {
        const { note, status, clientId, planId } = input
        const { data: plan }: { data: Plan } = await axios.patch(`${API_URL}/client/${clientId}/plan/${planId}`, { note, status });
        return {
          plan,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to patch plan data.");
      }
    }),
  updateClientActivity: publicProcedure
    .input(z.object({ clientId: z.string().min(1), activityId: z.string().min(1), note: z.string(), status: z.string() }))
    .mutation(async ({ input }): Promise<{ activity: Activity }> => {
      try {
        const { note, status, clientId, activityId } = input
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


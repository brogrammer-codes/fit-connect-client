import { type ActivityStatus, type PlanStatus } from "./status";

export type Client = {
    id: string;
    name: string;
    userId: string;
    description: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    planList: Plan[];
  };
  
  export type Activity = {
    id: string;
    name: string;
    userId: string;
    description: string;
    tag_1: string;
    tag_2: string;
    tag_3: string;
    tag_4: string;
    tag_5: string;
    tag_6: string;
    parentActivityId?: string | null;
    parentActivity?: Activity | null;
    childActivityList: Activity[];
    note?: string | null;
    status: ActivityStatus;
    videoUrl: string;
    createdAt: Date;
    updatedAt: Date;
    Plan?: Plan | null;
    planId?: string | null;
  };
  
  export type Plan = {
    id: string;
    name: string;
    userId: string;
    description: string;
    tag_1: string;
    tag_2: string;
    tag_3: string;
    tag_4: string;
    tag_5: string;
    tag_6: string;
    note?: string | null;
    status: PlanStatus;
    activityList: Activity[];
    clientId?: string | null;
    client?: Client | null;
    createdAt: Date;
    updatedAt: Date;
  };
  
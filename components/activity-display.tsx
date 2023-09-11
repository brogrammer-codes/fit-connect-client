import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import Link from "next/link";
import { Tags } from "types/plan";
import { VideoIcon } from "lucide-react";
import { type Plan } from "types/client";
import { Button } from "components/ui/button";
import { ActivityStatus } from "types/status";
import { StatusPill } from "./status-pill";

export const ActivityDisplay: React.FC<{
  plan: Plan;
  openActivityModal: (id: string) => void;
}> = ({ plan, openActivityModal }) => {
  return (
    <div className="flex flex-col space-y-2">
      {plan.activityList.map((activity) => activity.name.length ? (
        <Card key={activity.id} className="rounded border-none bg-slate-300 max-w-lg">
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col">
              <CardTitle className="flex flex-row justify-between">
                <span className="pr-2 font-semibold">{activity.name}</span>
                {activity.videoUrl ? (
                  <Link href={activity.videoUrl} target="_blank">
                    <VideoIcon />
                  </Link>
                ) : null}
              </CardTitle>
              <CardDescription>{activity.description}</CardDescription>
            </div>
            <StatusPill status={activity.status}/>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              {(Object.keys(Tags) as Array<keyof typeof Tags>).map((tag) =>
                plan[Tags[tag]] && activity[Tags[tag]] ? (
                  <span key={`${tag}-${activity.id}`}>{`${plan[Tags[tag]]}: ${
                    activity[Tags[tag]]
                  }`}</span>
                ) : null,
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full flex-col space-y-2">
              <span className="font-semibold text-sm text-slate-500">Your Notes</span>
              <span className="text-sm">{activity.note}</span>
              <Button
                variant={"ghost"}
                className="rounded bg-slate-400 text-lg font-semibold hover:bg-slate-600 hover:text-slate-100"
                onClick={() => openActivityModal(activity.id)}
                disabled={activity.status === ActivityStatus.COMPLETE}
              >
                Finish Activity/Add Note
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : null)}
    </div>
  );
};

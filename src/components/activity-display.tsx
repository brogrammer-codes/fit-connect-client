import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { Tags } from "types/plan";
import { Send, VideoIcon } from "lucide-react";
import { type Plan } from "types/client";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { ActivityStatus } from "types/status";
import { Button } from "~/components/ui/button";

export const ActivityDisplay: React.FC<{ plan: Plan }> = ({ plan }) => {
  const onActivityChange = (id: string, value: string) => {
    console.log(id, value);
  };
  return (
    <div className="flex flex-col space-y-2">
      {plan.activityList.map((activity) => (
        <Card key={activity.id} className="rounded border-none bg-slate-300">
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
            <span className="p-2 text-sm">{activity.status}</span>
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
              <Label htmlFor="notes">Notes</Label>
              <div className="flex space-x-2">
                <Textarea
                  id="notes"
                  onChange={(event) =>
                    onActivityChange(activity.id, event.target.value)
                  }
                  value={activity.note ?? ""}
                  className="rounded bg-slate-200 placeholder:text-slate-400"
                  placeholder="10, 10, 12. Felt easy..."
                  disabled={activity.status === ActivityStatus.COMPLETE}
                />
                <Button
                  disabled={activity.status === ActivityStatus.COMPLETE}
                  className="my-1 rounded bg-slate-100 px-1 text-slate-800 hover:text-emerald-600"
                  size="icon"
                >
                  <Send className="h-5 w-5"/>
                </Button>
                {/* <button
                  className="my-1 rounded bg-slate-100 px-1 text-slate-800 hover:text-emerald-600"
                  disabled={activity.status === ActivityStatus.COMPLETE}
                >
                </button> */}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

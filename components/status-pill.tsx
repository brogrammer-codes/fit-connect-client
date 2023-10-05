import { cn } from "src/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { ActivityStatus, PlanStatus } from "types/status";

interface StatusPillInterface {
  status: PlanStatus | ActivityStatus;
}

export const StatusPill: React.FC<StatusPillInterface> = ({ status }) => {
  let bgColor = "bg-red-500";
  switch (status) {
    case PlanStatus.DRAFT || ActivityStatus.DRAFT:
      bgColor = "bg-amber-500";
      break;
    case PlanStatus.ASSIGNED || ActivityStatus.ASSIGNED:
    case ActivityStatus.IN_PLAN:
      bgColor = "bg-sky-500";
      break;
    case PlanStatus.COMPLETE || ActivityStatus.COMPLETE:
      bgColor = "bg-emerald-600";
      break;
    default:
      break;
  }
  return (
    <Popover>
      <div className="flex px-2">
        <PopoverTrigger asChild>
          <div
            className={cn("h-4 w-4 rounded-full hover:cursor-pointer", bgColor)}
          />
        </PopoverTrigger>
      </div>
      <PopoverContent className="flex w-fit">{status}</PopoverContent>
    </Popover>
  );
};

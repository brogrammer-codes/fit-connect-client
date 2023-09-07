import { cn } from "src/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/ui/popover"
import type { ActivityStatus, PlanStatus } from "types/status";

interface StatusPillInterface {
  status: PlanStatus | ActivityStatus;
}

export const StatusPill: React.FC<StatusPillInterface> = ({ status }) => {
  let bgColor = "bg-red-500";
  switch (status) {
    case "DRAFT":
      bgColor = "bg-amber-500";
      break;
    case "ASSIGNED":
      case "IN_PLAN":
      bgColor = "bg-sky-500";
      break;
    case "COMPLETE":
      bgColor = "bg-emerald-600";
      break;
    default:
      break;
  }
  return (
    <Popover>
      <PopoverTrigger className="flex px-2"><div className={cn("w-4 h-4 rounded-full", bgColor)} /></PopoverTrigger>
      <PopoverContent className="flex w-fit">{status}</PopoverContent>
    </Popover>

  );
};

import { Modal } from "components/ui/modal";
import { Textarea } from "components/ui/textarea";
import { type Plan } from "types/client";
import { Label } from "components/ui/label";
import { PlanStatus } from "types/status";
import { Send } from "lucide-react";

interface PlanUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  updatePlanNote: (value: string) => void;
  loading?: boolean;
  plan?: Plan | null;
}

export const PlanUpdateModal: React.FC<PlanUpdateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  plan,
  updatePlanNote,
}) => {
  if ( !plan) {
    return null;
  }  
  return (
    <Modal
      title={`Do you want to complete ${plan.name}?`}
      description="You can complete this plan once you have finished it, you can add notes and close the modal to save any notes before completing it. Once you are done, you can hit send to complete the plan and leave feedback for your coach! Note: This will complete any activities in the plan as well."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <Label htmlFor="notes">Notes</Label>
        <div className="flex">
          <Textarea
            id="notes"
            onChange={(event) =>
              updatePlanNote(event.target.value)
            }
            value={plan.note ?? ""}
            className="rounded bg-slate-200 placeholder:text-slate-400"
            placeholder="10, 10, 12. Felt easy..."
            disabled={plan.status === PlanStatus.COMPLETE}
          />
          <button
            disabled={plan.status === PlanStatus.COMPLETE || loading}
            className="hover:rounded-r-xl bg-slate-100 p-1 text-slate-800 hover:text-emerald-600 hover:bg-slate-300 px-2"
            onClick={onConfirm}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

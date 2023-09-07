import { Modal } from "components/ui/modal";
import { Textarea } from "components/ui/textarea";
import { type Activity } from "types/client";
import { Label } from "components/ui/label";
import { ActivityStatus } from "types/status";
import { Send } from "lucide-react";

interface ActivityUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  updateActivityNote: (id: string, value: string) => void;
  loading?: boolean;
  activity?: Activity | null;
}

export const ActivityUpdateModal: React.FC<ActivityUpdateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  activity,
  updateActivityNote,
}) => {
  if ( !activity) {
    return null;
  }  
  return (
    <Modal
      title={`Do you want to complete ${activity.name}?`}
      description="You can complete this activity once you have finished it, you can add notes and close the modal to save any notes before completing it. Once you are done, you can hit send to complete the activity and leave feedback for your coach!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <Label htmlFor="notes">Notes</Label>
        <div className="flex">
          <Textarea
            id="notes"
            onChange={(event) =>
              updateActivityNote(activity.id, event.target.value)
            }
            value={activity.note ?? ""}
            className="rounded bg-slate-200 placeholder:text-slate-400"
            placeholder="10, 10, 12. Felt easy..."
            disabled={activity.status === ActivityStatus.COMPLETE}
          />
          <button
            disabled={activity.status === ActivityStatus.COMPLETE || loading}
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

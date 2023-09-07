import { useEffect, useState } from "react";

import { Modal } from "components/ui/modal";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { type Activity } from "types/client";
import { Label } from "components/ui/label";
import { ActivityStatus } from "types/status";
import { Send } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  updateActivityNote: (id: string, value: string) => void;
  loading?: boolean;
  activity?: Activity;
}

export const ActivityUpdateModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  activity,
  updateActivityNote
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !activity) {
    return null;
  }

  return (
    <Modal
      title={`Do you want to complete ${activity.name}?`}
      description="You can complete this activity once you have finished it, add some notes as a feedback for your coach!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <Label htmlFor="notes">Notes</Label>
        <div className="flex space-x-2">
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
          <Button
            disabled={activity.status === ActivityStatus.COMPLETE}
            className="my-1 rounded bg-slate-100 px-1 text-slate-800 hover:text-emerald-600"
            size="icon"
            onClick={onConfirm}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

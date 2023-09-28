import * as z from "zod";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Modal } from "components/ui/modal";
import { Textarea } from "components/ui/textarea";
import { type Activity } from "types/client";
import { Label } from "components/ui/label";
import { ActivityStatus } from "types/status";
import { CheckCircle, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const formSchema = z.object({
  note: z.string().min(0),
});
type ActivityFormValues = z.infer<typeof formSchema>;

interface ActivityUpdateModalProps {
  isOpen: boolean;
  onClose: (note: string, complete: boolean) => void;
  loading?: boolean;
  activity?: Activity | null;
}

export const ActivityUpdateModal: React.FC<ActivityUpdateModalProps> = ({
  isOpen,
  onClose,
  loading,
  activity,
}) => {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
    },
  });
  useEffect(() => {
    if (activity?.note) {
      form.setValue("note", activity.note);
    }

    return () => {
      form.reset();
    };
  }, [activity, form]);
  const onSubmit = (data: ActivityFormValues) => {
    onClose(data.note, true);
  };
  const closeModal = () => {
    onClose(form.getValues("note"), false);
  };
  if (!activity) {
    return null;
  }
  return (
    <Modal
      title={`Do you want to complete ${activity.name}?`}
      description="You can complete this activity once you have finished it, you can add notes and close the modal to save any notes before completing it. Once you are done, you can hit send to complete the activity and leave feedback for your coach!"
      isOpen={isOpen}
      onClose={closeModal}
    >
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Form {...form}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit(onSubmit)(event);
            }}
            className="w-full space-y-8"
          >
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl className="flex gap-2">
                      <Textarea
                        placeholder="10, 10, 12. Felt easy..."
                        disabled={activity.status === ActivityStatus.COMPLETE}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-center gap-2">
                <Button
                  disabled={
                    activity.status === ActivityStatus.COMPLETE || loading
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    closeModal();
                  }}
                  className="gap-2"
                  variant={'outline'}
                >
                  Add Note <Send className="h-5 w-5" />
                </Button>
                <Button
                  disabled={
                    activity.status === ActivityStatus.COMPLETE || loading
                  }
                  type="submit"
                  className="gap-2 bg-lime-700 hover:bg-lime-600"
                >
                  Add Note And Complete Activity
                  <CheckCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

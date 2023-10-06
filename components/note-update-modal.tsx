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
import type { Plan, Activity } from "types/client";
import { Label } from "components/ui/label";
import { ActivityStatus } from "types/status";
import { CheckCircle, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const formSchema = z.object({
  note: z.string().min(0),
});
type NoteFormValues = z.infer<typeof formSchema>;

interface NoteUpdateModalProps {
  isOpen: boolean;
  onClose: (note: string, complete: boolean) => void;
  description: string;
  placeholder?: string;
  loading?: boolean;
  initialData?: Activity | null | Plan;
}

export const NoteUpdateModal: React.FC<NoteUpdateModalProps> = ({
  isOpen,
  onClose,
  loading,
  placeholder,
  initialData,
  description,
}) => {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
    },
  });
  useEffect(() => {
    if (initialData?.note) {
      form.setValue("note", initialData.note);
    }
    return () => {
      form.reset();
    };
  }, [initialData, form]);

  const onSubmit = (data: NoteFormValues) => {
    onClose(data.note, true);
  };
  const closeModal = () => {
    onClose(form.getValues("note"), false);
  };
  if (!initialData) {
    return null;
  }
  return (
    <Modal
      title={`Do you want to complete or add notes to ${initialData.name}?`}
      description={description}
      isOpen={isOpen}
      onClose={closeModal}
    >
      <div>
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
                    <FormLabel>Notes</FormLabel>
                    <FormControl className="flex gap-2">
                      <Textarea
                        placeholder={placeholder ?? "10, 10, 12. Felt easy..."}
                        disabled={
                          initialData.status === ActivityStatus.COMPLETE
                        }
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
                    initialData.status === ActivityStatus.COMPLETE || loading
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    closeModal();
                  }}
                  className="gap-2"
                  variant={"outline"}
                >
                  Add Note <Send className="h-4 w-4" />
                </Button>
                <Button
                  disabled={
                    initialData.status === ActivityStatus.COMPLETE || loading
                  }
                  type="submit"
                  className="gap-2 bg-emerald-600 hover:bg-emerald-600"
                >
                  Add Note + Complete
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

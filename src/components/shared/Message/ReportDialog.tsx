"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const reportSchema = z.object({
  reason: z.enum(["violent", "aggressive", "others"], {
    required_error: "Please select a reason for reporting this user.",
  }),
  details: z.string().min(10, {
    message: "Please provide at least 10 characters explaining the issue.",
  }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportUserDialogProps {
  userName?: string;
}

export function ReportDialog({
  userName = "this user",
}: ReportUserDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reason: undefined,
      details: "",
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    console.log("Report submitted:", data);
    // Handle form submission here
    setOpen(false);
    form.reset();
  };

  const handleBlockUser = () => {
    console.log("Block user clicked");
    // Handle block user action
  };

  const handleDeleteConversation = () => {
    console.log("Delete conversation clicked");
    // Handle delete conversation action
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer px-2">
        <div className="flex flex-row gap-x-1.5 items-center">
          <Ban className="text-destructive size-4" />
          <p className='font-medium'>Report</p>
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-[425px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Report this user
          </DialogTitle>
          <DialogDescription className="sr-only">
            Report {userName} for inappropriate behavior
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-1"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="violent" id="violent" className="border-black" />
                        <FormLabel
                          htmlFor="violent"
                          className="font-normal cursor-pointer"
                        >
                          Violent, hateful or disturbing
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="aggressive" id="aggressive" className="border-black" />
                        <FormLabel
                          htmlFor="aggressive"
                          className="font-normal cursor-pointer"
                        >
                          Aggressive
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="others" id="others" className="border-black" />
                        <FormLabel
                          htmlFor="others"
                          className="font-normal cursor-pointer"
                        >
                          Others Reason
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Write Something here....."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-none h-10 cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              SUBMIT
            </Button>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useFinishAuthMutation } from "@/redux/api/authApi";
import { getFirstErrorMessage } from "@/utils/modifyFormError";
import { buildAuthFinishFormData } from "../submitAuthFinish";

export const AMBASSADOR_CATEGORIES = [
  "Fashion Enthusiast",
  "Content Creator",
  "Sustainable Fashion Advocate",
  "Community Ambassador",
] as const;

const ambassadorSchema = z.object({
  ambassadorCategory: z
    .string({ required_error: "Ambassador category is required" })
    .min(1, "Ambassador category is required"),
  instagramUsername: z.string().optional(),
  tiktokUsername: z.string().optional(),
  aboutYou: z
    .string({ required_error: "Please tell us a little about yourself" })
    .min(1, "Please tell us a little about yourself"),
  agreementAcceptedAt: z.string().optional(),
});

type AmbassadorFormValues = z.infer<typeof ambassadorSchema>;

export default function AmbassadorForm({
  onSuccess,
}: {
  onSuccess: (message?: string) => void;
}) {
  const [acceptedAgreement, setAcceptedAgreement] = useState(false);
  const [finishAuth, { isLoading }] = useFinishAuthMutation();

  const form = useForm<AmbassadorFormValues>({
    resolver: zodResolver(ambassadorSchema),
    defaultValues: {
      ambassadorCategory: "",
      instagramUsername: "",
      tiktokUsername: "",
      aboutYou: "",
      agreementAcceptedAt: "",
    },
  });

  const onError = (errors: any) => {
    toast.error(getFirstErrorMessage(errors));
  };

  const onSubmit = async (values: AmbassadorFormValues) => {
    if (!acceptedAgreement) {
      toast.error("Please agree to the Fashi-ON Ambassador Programme Terms & Conditions");
      return;
    }

    try {
      const token = sessionStorage.getItem("signUpToken") || undefined;
      const payload = {
        ambassadorType: values?.ambassadorCategory,
        instagramUsername: values?.instagramUsername || undefined,
        tiktokUsername: values?.tiktokUsername || undefined,
        about: values?.aboutYou,
        agreementVersion: "1.0",
        agreementAcceptedAt: new Date().toISOString(),
      };
      const formData = buildAuthFinishFormData(payload, []);
      const res = await finishAuth({ formData, token }).unwrap();
      onSuccess(res?.message);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit verification details");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="md:space-y-6 space-y-4"
      >
        <FormField
          control={form.control}
          name="ambassadorCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900">
                Ambassador Category <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3.5 w-full cursor-pointer">
                    <SelectValue placeholder="Select an ambassador category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {AMBASSADOR_CATEGORIES.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="cursor-pointer"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="instagramUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  Instagram Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. yourusername"
                    {...field}
                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3.5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tiktokUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  TikTok Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. yourusername"
                    {...field}
                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3.5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="aboutYou"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900">
                About You <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about yourself and why you’d like to become a Fashi-ON Ambassador."
                  rows={4}
                  {...field}
                  className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base px-3.5 py-3"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-start space-x-2.5 pt-1">
          <Checkbox
            id="ambassador-agreement"
            checked={acceptedAgreement}
            onCheckedChange={(checked) => {
              const isChecked = Boolean(checked);
              setAcceptedAgreement(isChecked);
              form.setValue(
                "agreementAcceptedAt",
                isChecked ? new Date().toISOString() : ""
              );
            }}
            className="mt-0.5 cursor-pointer"
          />
          <label
            htmlFor="ambassador-agreement"
            className="text-sm text-gray-700 leading-snug cursor-pointer select-none"
          >
            I agree to the Fashi-ON Ambassador Programme Terms & Conditions.
          </label>
        </div>

        <Button
          variant="default"
          disabled={isLoading || !acceptedAgreement}
          type="submit"
          className="rounded-full h-11 w-full cursor-pointer text-base"
        >
          {isLoading ? (
            <span className="loader"></span>
          ) : (
            "Apply to Become an Ambassador"
          )}
        </Button>
      </form>
    </Form>
  );
}

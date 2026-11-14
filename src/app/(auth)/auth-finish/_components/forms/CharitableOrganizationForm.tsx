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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFinishAuthMutation } from "@/redux/api/authApi";
import { getFirstErrorMessage } from "@/utils/modifyFormError";
import RegistrationCountryField from "../RegistrationCountryField";
import DocumentUploadField from "../DocumentUploadField";
import { buildAuthFinishFormData } from "../submitAuthFinish";

const charitableOrganizationSchema = z.object({
  legalName: z
    .string({ required_error: "Legal organisation name is required" })
    .min(1, "Legal organisation name is required"),
  registrationNumber: z.string().optional(),
  registrationCountry: z
    .string({ required_error: "Registration country is required" })
    .min(1, "Registration country is required"),
  registeredAddress: z.string().optional(),
  authorizedPersonName: z
    .string({ required_error: "Authorized person name is required" })
    .min(1, "Authorized person name is required"),
  authorizedPersonRole: z
    .string({ required_error: "Authorized person role is required" })
    .min(1, "Authorized person role is required"),
});

type CharitableOrganizationFormValues = z.infer<typeof charitableOrganizationSchema>;

export default function CharitableOrganizationForm({
  onSuccess,
}: {
  onSuccess: (message?: string) => void;
}) {
  const [documents, setDocuments] = useState<File[]>([]);
  const [finishAuth, { isLoading }] = useFinishAuthMutation();

  const form = useForm<CharitableOrganizationFormValues>({
    resolver: zodResolver(charitableOrganizationSchema),
    defaultValues: {
      legalName: "",
      registrationNumber: "",
      registrationCountry: "",
      registeredAddress: "",
      authorizedPersonName: "",
      authorizedPersonRole: "",
    },
  });

  const onError = (errors: any) => {
    toast.error(getFirstErrorMessage(errors));
  };

  const onSubmit = async (values: CharitableOrganizationFormValues) => {
    if (documents.length === 0) {
      toast.error("Please upload your verification documents");
      return;
    }

    try {
      const token = sessionStorage.getItem("signUpToken") || undefined;
      const formData = buildAuthFinishFormData(values, documents);
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
          name="legalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900">
                Legal Organisation Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter legal organisation name"
                  {...field}
                  className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3.5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  Organisation Registration Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter organisation registration number"
                    {...field}
                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3.5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <RegistrationCountryField
            control={form.control}
            name="registrationCountry"
            label="Registration Country"
            required
          />
        </div>

        <FormField
          control={form.control}
          name="registeredAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900">
                Registered Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter registered address"
                  {...field}
                  className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3.5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="authorizedPersonName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  Authorized Person Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter authorized person's full name"
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
            name="authorizedPersonRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  Authorized Person Role <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Director, Trustee, Secretary"
                    {...field}
                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3.5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DocumentUploadField
          documents={documents}
          setDocuments={setDocuments}
          label="Verification Documents"
          description="Upload charity registration certificate and authorization document (PDF, JPG, PNG)."
          inputId="charity-org-docs"
        />

        <Button
          variant="default"
          disabled={isLoading}
          type="submit"
          className="rounded-full h-11 w-full cursor-pointer text-base"
        >
          {isLoading ? <span className="loader"></span> : "Submit for Verification"}
        </Button>
      </form>
    </Form>
  );
}


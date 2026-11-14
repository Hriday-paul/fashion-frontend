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

const charityShopSchema = z.object({
  shopName: z
    .string({ required_error: "Shop name is required" })
    .min(1, "Shop name is required"),
  operatorType: z
    .string({ required_error: "Operator type is required" })
    .min(1, "Operator type is required"),
  legalBusinessName: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  registrationCountry: z.string().optional(),
  charityRegistrationNumber: z.string().optional(),
  charityRelationship: z.string().optional(),
});

type CharityShopFormValues = z.infer<typeof charityShopSchema>;

export default function CharityShopForm({
  onSuccess,
}: {
  onSuccess: (message?: string) => void;
}) {
  const [documents, setDocuments] = useState<File[]>([]);
  const [finishAuth, { isLoading }] = useFinishAuthMutation();

  const form = useForm<CharityShopFormValues>({
    resolver: zodResolver(charityShopSchema),
    defaultValues: {
      shopName: "",
      operatorType: "",
      legalBusinessName: "",
      businessRegistrationNumber: "",
      registrationCountry: "",
      charityRegistrationNumber: "",
      charityRelationship: "",
    },
  });

  const onError = (errors: any) => {
    toast.error(getFirstErrorMessage(errors));
  };

  const onSubmit = async (values: CharityShopFormValues) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  Shop Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter shop name"
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
            name="operatorType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  Operator Type <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Registered Charity, Subsidiary, Partner"
                    {...field}
                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3.5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="legalBusinessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  Legal Organisation Name
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

          <FormField
            control={form.control}
            name="businessRegistrationNumber"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <RegistrationCountryField
            control={form.control}
            name="registrationCountry"
            label="Registration Country"
          />

          <FormField
            control={form.control}
            name="charityRegistrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  Charity Registration Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter charity registration number"
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
          name="charityRelationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900">
                Charity Relationship
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe relationship with the charity"
                  {...field}
                  className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3.5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DocumentUploadField
          documents={documents}
          setDocuments={setDocuments}
          label="Verification Documents"
          description="Upload charity shop registration and authorization documents (PDF, JPG, PNG)."
          inputId="charity-shop-docs"
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


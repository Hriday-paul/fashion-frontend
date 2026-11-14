"use client";
import React, { useState, useEffect, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Camera, CheckCircle2, Info, Pencil, X } from "lucide-react";
import InputCharityDonationInput from "@/components/shared/UserProfile/AddProduct/InputCharityDonationInput"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useGetCharitiesQuery } from "@/redux/api/userApi";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserRole } from "@/types";
import Image from "next/image";
import { defaultImg } from "@/utils/defaultImg";
import UpdateShippingAddress from "@/components/shared/UserProfile/AddProduct/UpdateShippingAddress";
import { RequestNewAssitentSell } from "@/lib/Actions/AssistentSell.action";
import { toast } from "sonner";
import { formattedAssistedSellerData } from "./util";
import { SuccessModal } from "@/components/shared/Modal/SuccessModal";
import Link from "next/link";
import { useCurrency } from "@/hooks/useCurrency";
import dynamic from "next/dynamic";
import { getFirstErrorMessage } from "@/utils/modifyFormError";
import { AssistedParcelSizeGuide, ParcelDimensions } from "./AssistedParcelSizeGuide";
import DonationPrivacyAbout from "@/components/shared/DonationPrivacyAbout";
import DonationAbout from "@/components/shared/DonationAbout";

const ImageEditorModal = dynamic(() => import("@/components/shared/ImageEditorModal"), {
  ssr: false,
});

const MAX_PHOTOS = 8;
const INPUT_ID = "assisted-photo-uploader-input";

export const formSchema = z.object({
  itemsTitle: z.string({ required_error: "Item title is required." }).min(1, {
    message: "Item title is required.",
  }),
  itemsCount: z.string({ required_error: "Item count is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 1, {
    message: "Item count must be a valid positive number greater than 1.",
  }),

  images: z.array(z.string()).min(1, "At least 1 image is required"),

  itemsDetails: z.string().optional(),
  additionalNotes: z.string().optional(),

  priceType: z.enum(["TARGET_AMOUNT", "DISCUSSION", "MARKET_PRICE"], {
    errorMap: () => ({ message: "Please select a pricing option" }),
  }).default("MARKET_PRICE"),

  targetPrice: z.string().optional(),

  contactNumber: z.string().optional(),

  charities: z.array(z.string()).optional(),
  donationPct: z.string().optional(),

  donationAnonymous: z.boolean().default(false),

  weight_kg: z.string({ required_error: "Weight is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Weight must be a valid positive number.",
  }),

  length_cm: z.string({ required_error: "Length is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Length must be a valid positive number.",
  }),

  width_cm: z.string({ required_error: "Width is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Width must be a valid positive number.",
  }),

  hight_cm: z.string({ required_error: "Height is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Height must be a valid positive number.",
  }),

})

const CharityFormSchema = z.object({
  charities: z
    .array(z.string().min(1, "Charity id cannot be empty"))
    .min(1, "Please select at least one charity"),

  donationPct: z.string({ required_error: "Donation Percent is required." }).min(1, {
    message: "Donation Percent is required.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function AssistedSellerForm() {
  const formTopRef = useRef<HTMLDivElement>(null);
  const { data: charitiesData } = useGetCharitiesQuery();
  const user = useSelector((state: RootState) => state.auth.user);
  const { symbol } = useCurrency();
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const scrollToFormTop = useCallback(() => {
    if (typeof window !== "undefined") {
      if (formTopRef.current) {
        formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleSuccessDialogChange = useCallback((open: boolean) => {
    setOpenSuccessDialog(open);
    if (!open) {
      scrollToFormTop();
    }
  }, [scrollToFormTop]);

  const [error, setError] = useState<string | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<{
    file: Blob | File;
    index: number | null;
    name?: string;
  } | null>(null);

  const isCharityShop = user?.auth?.role === UserRole.CHARITY_SHOP;
  const required_Charity = user?.auth?.role !== UserRole.ECO_FRIENDLY_STORE && !isCharityShop;

  const schema = (required_Charity ? formSchema.merge(CharityFormSchema) : formSchema).superRefine(
    (data, ctx) => {
      if (data.priceType === "TARGET_AMOUNT") {
        const val = Number(data.targetPrice)
        if (!data.targetPrice || isNaN(val) || val <= 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Target price is required and must be greater than 1.",
            path: ["targetPrice"],
          })
        }
      }
    }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      charities: [],
      donationPct: required_Charity ? "5" : "0",
      images: [],
      donationAnonymous: true,
      priceType: "MARKET_PRICE",
    },
  })

  const onError = (errors: any) => {
    const firstErrorMessage = getFirstErrorMessage(errors);
    if (firstErrorMessage) {
      toast.error(firstErrorMessage);
    }
  };

  async function onSubmit(values: FormValues) {
    setError(null);
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(formattedAssistedSellerData(values)));

      images.forEach((file) => {
        formData.append("images", file); // ✅ real File object
      });

      const res = await RequestNewAssitentSell({ payload: formData });
      if (!res.success) {
        throw new Error(res.message);
      }

      //reset the form and uploaded images
      form.reset();
      setImages([]);

      scrollToFormTop();

      setOpenSuccessDialog(true);

    } catch (err: any) {
      toast.error(err?.message || "An error occurred while submitting the form.");
      setError(err?.message || "Something went wrong. Please try again.");
    }
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []).filter(
      (f) => f.type.startsWith("image/")
    );
    e.target.value = "";
    if (incoming.length === 0) return;

    const availableSlots = MAX_PHOTOS - images.length;
    if (availableSlots <= 0) {
      toast.error(`You can only upload up to ${MAX_PHOTOS} photos`);
      return;
    }

    const filesToProcess = incoming.slice(0, availableSlots);

    // If multiple images are selected at once, directly add them without opening the editor
    if (filesToProcess.length > 1) {
      const nextImages = [...images, ...filesToProcess];
      setImages(nextImages);
      form.setValue(
        "images",
        nextImages.map((f) => f.name),
        { shouldValidate: true }
      );
      return;
    }

    // Single image uploaded: open image editor
    const singleFile = filesToProcess[0];
    setEditingImage({ file: singleFile, index: null, name: singleFile.name });
    setEditorModalOpen(true);
  };

  const handleEditExisting = (index: number) => {
    const existingFile = images[index];
    if (!existingFile) return;
    setEditingImage({
      file: existingFile,
      index,
      name: (existingFile as File).name || `assisted-photo-${index + 1}.jpg`,
    });
    setEditorModalOpen(true);
  };

  const handleSaveEditor = useCallback(
    (blob: Blob) => {
      const filename = editingImage?.name || `assisted-photo-${Date.now()}.jpg`;
      const finalFile = new File([blob], filename, { type: blob.type || "image/jpeg" });

      let nextImages: File[];
      if (editingImage?.index !== null && editingImage?.index !== undefined) {
        // Editing existing image
        nextImages = images.map((img, i) => (i === editingImage.index ? finalFile : img));
      } else {
        // New single image uploaded
        nextImages = [...images, finalFile];
      }

      setImages(nextImages);
      form.setValue(
        "images",
        nextImages.map((f) => f.name),
        { shouldValidate: true }
      );

      setEditingImage(null);
      setEditorModalOpen(false);
    },
    [editingImage, images, form]
  );

  const handleCloseEditor = useCallback(() => {
    setEditorModalOpen(false);
    setEditingImage(null);
  }, []);

  const removeFile = (index: number) => {
    const nextImages = images.filter((_, i) => i !== index);
    setImages(nextImages);
    form.setValue(
      "images",
      nextImages.map((f) => f.name),
      { shouldValidate: true }
    );
  };

  const visibleSlots = Math.min(images.length + 1, MAX_PHOTOS);
  const boxes = Array.from({ length: visibleSlots });

  const handleApplySuggestedParcel = (dimensions: ParcelDimensions) => {
    form.setValue("weight_kg", dimensions.weight_kg, { shouldValidate: true, shouldDirty: true });
    form.setValue("length_cm", dimensions.length_cm, { shouldValidate: true, shouldDirty: true });
    form.setValue("width_cm", dimensions.width_cm, { shouldValidate: true, shouldDirty: true });
    form.setValue("hight_cm", dimensions.hight_cm, { shouldValidate: true, shouldDirty: true });
  };

  const priceType = form.watch("priceType")

  return (
    <div ref={formTopRef} className="md:space-y-6 space-y-3 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assited Sell</h1>
        <p className="text-muted-foreground">Complete the form below to submit items for our assisted seller service. <Link href="/help/assisted-seller" className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700">Learn more about assisted selling</Link>.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* Items Count */}
          <FormField
            control={form.control}
            name="itemsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">How many items are you sending?</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="eg: 4" className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Images */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                  <div>
                    <FormLabel className="text-base font-semibold text-gray-900">BundlePhotos</FormLabel>
                    <p className="text-sm text-gray-500">Add your listing bundle photos here.</p>
                  </div>
                </div>

                <FormControl>
                  <input
                    id={INPUT_ID}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    multiple
                    className="hidden"
                    onChange={handleFiles}
                  />
                </FormControl>

                <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-4">
                  {boxes.map((_, i) => {
                    const file = images[i];

                    if (file) {
                      return (
                        <PhotoBoxItem
                          key={i}
                          file={file}
                          index={i}
                          onEdit={handleEditExisting}
                          onRemove={removeFile}
                        />
                      );
                    }

                    return (
                      <label
                        key={i}
                        htmlFor={INPUT_ID}
                        className="aspect-square rounded border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 transition-all cursor-pointer hover:border-black hover:text-black hover:bg-gray-50"
                      >
                        <Camera size={22} strokeWidth={1.75} />
                        <span className="text-[11px] font-medium mt-1 text-gray-500">
                          {i === 0 ? "Add A Bundle Photo" : "Add More"}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">Contact Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    // @ts-ignore
                    value={field.value}
                    onChange={field.onChange}
                    international
                    defaultCountry="US"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="itemsTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">Items Title</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="eg: Vintage denim & leather bundle" className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="itemsDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">Item Details (Optional)</FormLabel>
                <FormDescription>e.g. brand, size, condition, original price, any flaws, how it fits</FormDescription>
                <FormControl>
                  <Textarea placeholder="Describe your item..." className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base px-3 min-h-24" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className=" bg-white">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-4 text-lg text-gray-900">How would you like us to handle pricing?</h3>
              </div>

              <FormField
                control={form.control}
                name="priceType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        {/* Option 1: Let Fashi-ON Decide */}
                        <div className="flex items-start space-x-3 mb-1.5 p-3 rounded hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="MARKET_PRICE" id="option-1" className="mt-1" />
                          <Label htmlFor="option-1" className="font-medium cursor-pointer flex flex-col items-start">
                            <p className="text-base font-medium">Let Fashi-ON decide (recommended)</p>
                            <span className="text-sm text-muted-foreground mt-0.5">
                              We'll set the best market price and email you before we list.
                            </span>
                          </Label>
                        </div>

                        {/* Option 2: Tell Us What You'd Like to Earn */}
                        <div className="flex items-start space-x-3 mb-1.5 p-3 rounded hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="TARGET_AMOUNT" id="option-2" className="mt-1" />
                          <Label htmlFor="option-2" className="font-medium cursor-pointer flex flex-col items-start">
                            <p className="text-base font-medium">Tell us what you'd like to earn</p>
                            <span className="text-sm text-muted-foreground mt-0.5">
                              Roughly how much you'd like to receive after our fees{required_Charity ? " and your donation" : ""}
                            </span>

                            {priceType === "TARGET_AMOUNT" && (
                              <div className="mt-3 w-full">
                                <FormField
                                  control={form.control}
                                  name="targetPrice"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <InputGroup className="bg-white border-[#e1e1e1] rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black !py-5">
                                          <InputGroupInput type="number" step="any" placeholder="eg: 100" {...field} className="!text-base" />
                                          <InputGroupAddon align={"inline-start"} className="text-primary-black text-lg" >
                                            {symbol}
                                          </InputGroupAddon>
                                        </InputGroup>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}

                          </Label>
                        </div>

                        {/* Option 3: Discuss First */}
                        <div className="flex items-start space-x-3 p-3 rounded hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="DISCUSSION" id="option-3" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="option-3" className="font-medium cursor-pointer flex flex-col items-start justify-start">
                              <p className="text-base font-medium">I'd like to discuss first</p>
                              <span className="text-sm text-muted-foreground mt-1">
                                We'll call or email you to agree a price before listing.
                              </span>
                            </Label>

                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {required_Charity && <>
            {/* =================donation================== */}
            <div className="space-y-4 mt-12">
              <div>
                <div className="flex lg:flex-row flex-col justify-between items-start gap-2 mb-6">

                  <div>
                    <div className="flex flex-row gap-x-0.5 items-center">
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">Donation</p>

                      <DonationAbout />

                    </div>
                    <>
                      <span className="text-xs">
                        (Minimum 5% donation required)
                      </span>
                      {/* <SelectDonationOption /> */}
                    </>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg bg-blue-50 px-4 py-4 sm:px-5 sm:py-5 max-w-md">
                    <Info
                      className="mt-0.5 size-6 shrink-0 fill-blue-400 text-white"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <p className="text-sm text-gray-800">
                      Your chosen percentage will be donated to the selected charity once the item is sold.{" "}
                      <Link
                        href="/help/donations"
                        className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
                      >
                        Learn more about donations
                      </Link>
                      .
                    </p>
                  </div>
                </div>

              </div>

              <div className="my-5 space-y-3 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                <FormField
                  control={form.control}
                  name="donationPct"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donation Percent (%)</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3 w-full cursor-pointer">
                              <SelectValue placeholder="Select Donation Percent" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none p-0">
                            {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map((item) => (
                              <SelectItem value={item.toString()} key={item} className="rounded-none cursor-pointer">
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InputCharityDonationInput charities={charitiesData?.data || []} form={form} name="charities" />

              </div>

            </div>


            {/* Donation Privacy */}
            <div>
              <p className="mb-5 font-medium flex flex-row gap-1 items-center">
                Donation Privacy: Would you like to remain anonymous?
                <DonationPrivacyAbout />
              </p>
              <FormField
                control={form.control}
                name="donationAnonymous"
                render={({ field }) => (
                  <FormItem className="md:space-y-3 space-y-1">

                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex flex-col md:space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="anonymous" />
                          <label htmlFor="anonymous" className="text-sm">
                            Yes, keep my donation anonymous
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="show-name" />
                          <label htmlFor="show-name" className="text-sm">
                            No, show my name
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>}

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter any additional notes" className="min-h-20 bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base px-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ============Shipment================ */}

          <div className="space-y-3 mt-12">
            <p className="text-lg lg:text-xl font-semibold text-gray-900">Shipping</p>
            <UpdateShippingAddress />

            <div className="mt-8">
              <p className="text-lg lg:text-xl font-semibold text-gray-900 mb-5">Parcel Size</p>

              <AssistedParcelSizeGuide onApply={handleApplySuggestedParcel} />

              {/* ========================================= Price and Discount ============================== */}
              <div className="grid grid-cols-2 md:gap-4 gap-2 items-start">

                <FormField
                  control={form.control}
                  name="weight_kg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <InputGroup className="bg-white border-[#e1e1e1] rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black !py-5">
                          <InputGroupInput type="number" step="any" placeholder="eg: 0.3" {...field} className="!text-base" />
                          <InputGroupAddon align={"inline-end"} className="text-primary-black text-lg" >
                            kg
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hight_cm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <InputGroup className="bg-white border-[#e1e1e1] rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black !py-5">
                          <InputGroupInput type="number" step="any" placeholder="eg: 10" {...field} className="!text-base" />
                          <InputGroupAddon align={"inline-end"} className="text-primary-black text-lg" >
                            cm
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="width_cm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width (cm)</FormLabel>
                      <FormControl>
                        <InputGroup className="bg-white border-[#e1e1e1] rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black !py-5">
                          <InputGroupInput type="number" step="any" placeholder="eg: 20" {...field} className="!text-base" />
                          <InputGroupAddon align={"inline-end"} className="text-primary-black text-lg" >
                            cm
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="length_cm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (cm)</FormLabel>
                      <FormControl>
                        <InputGroup className="bg-white border-[#e1e1e1] rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black !py-5">
                          <InputGroupInput type="number" step="any" placeholder="eg: 6" {...field} className="!text-base" />
                          <InputGroupAddon align={"inline-end"} className="text-primary-black text-lg" >
                            cm
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

          </div>

          <div className="flex items-start gap-2 lg:gap-4 rounded-lg bg-blue-50 px-4 py-4 sm:px-5 sm:py-5">
            <Info
              className="mt-0.5 size-7 shrink-0 fill-blue-400 text-white"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-base">Assisted Seller Service</p>
              <p className="text-sm text-gray-800">
                Our assisted seller fee is 30% of the each sale price{required_Charity ? ", before your chosen charity donation" : ""}.

                <br />

                We’ll confirm the listing details and price with you before your items go live.

                <br />

                Please package your items securely. You can send single items or multiple items in one parcel.

                <br />

                We aim to sell items within 30 days. After this, you can request their return (return shipping may apply).{" "}
                <Link
                  href="/help/assisted-seller#selling-window-and-returns"
                  className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
                >
                  Terms & Conditions apply
                </Link>
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          <Button disabled={form?.formState?.isSubmitting} type="submit" variant={"default"} className="flex-1 group cursor-pointer rounded-none py-5 w-full">
            {form?.formState?.isSubmitting ? <span className="loader" /> : "Ready to Submit"}
          </Button>

        </form>
      </Form>

      <SuccessModal open={openSuccessDialog} setOpen={handleSuccessDialogChange} content={<div className="p-5">

        <div className="flex justify-center mb-5">
          <CheckCircle2 className="w-14 h-14 text-green-500" strokeWidth={1.75} />
        </div>

        {/* Heading */}
        <p className="text-center text-xl font-semibold text-gray-900 leading-snug mb-2">
          Request Submitted Successfully
        </p>

        {/* Subtext */}
        <p className="text-center text-sm text-gray-500 leading-relaxed mb-6">
          Your request has been recorded and is now
          under review.
        </p>

        {/* Info card */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-base font-semibold text-gray-900 mb-2">
            What happens next?
          </p>
          <ul className="space-y-2">
            <li className="flex text-sm text-gray-700">
              <span className="mr-2 mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
              <span>
                The request will be reviewed by our <span className="text-primary-black font-medium">FASHI-ON</span> team.
              </span>
            </li>
            <li className="flex text-sm text-gray-700">
              <span className="mr-2 mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
              <span>
                Approval or rejection will depend on review of the items and compliance with our assisted seller guidelines.
              </span>
            </li>
            <li className="flex text-sm text-gray-700">
              <span className="mr-2 mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
              <span>
                Once a decision is made, the request status will be updated
                in the system.
              </span>
            </li>
          </ul>

          <p className="text-sm text-gray-800 mt-4">
            You can continue checking the status of this request from the
            system under <Link href="/profile/assisted-sell" className="font-semibold text-gray-900 underline">Assisted Sell</Link>.
          </p>
        </div>
      </div>} />

      <ImageEditorModal
        isOpen={editorModalOpen}
        onClose={handleCloseEditor}
        image={editingImage?.file ?? null}
        onSave={handleSaveEditor}
      />

    </div>
  )
}

function PhotoBoxItem({
  file,
  index,
  onEdit,
  onRemove,
}: {
  file: File | Blob;
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  const [objectUrl, setObjectUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="group relative aspect-square rounded border border-gray-200 transition-colors overflow-hidden bg-white shadow-xs">
      {objectUrl && (
        <Image
          src={objectUrl}
          alt={`Assisted item photo ${index + 1}`}
          className="w-full h-full object-cover"
          height={500}
          width={500}
          unoptimized
        />
      )}

      {/* Top right remove button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute top-1.5 right-1.5 bg-black text-white hover:bg-neutral-800 rounded-full w-6 h-6 flex items-center justify-center shadow-md transition-opacity cursor-pointer z-10"
        aria-label="Remove photo"
      >
        <X size={13} strokeWidth={2.5} />
      </button>

      {/* Primary photo indicator on index 0 */}
      {index === 0 && (
        <span className="absolute top-1.5 left-1.5 bg-black text-white text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm z-10 pointer-events-none">
          Cover
        </span>
      )}

      {/* Overlay on hover */}
      <button
        type="button"
        onClick={() => onEdit(index)}
        className="text-white px-2.5 py-1 text-xs font-medium flex items-center gap-1 shadow-md transition-transform cursor-pointer absolute bottom-0 left-0 bg-black/70 w-full justify-center"
        title="Edit photo"
      >
        <Pencil size={12} strokeWidth={2} />
        <span>Adjust Photo</span>
      </button>
    </div>
  );
}

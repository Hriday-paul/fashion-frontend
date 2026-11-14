"use client";
import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { X, Camera, CheckCircle2, Pencil, Info, } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  buildProductSchema,
  CharityFormSchema,
  colors,
  conditionOptions,
  productFormDefaultValues,
  productFormSchema,
  ProductFormValues,
  returnsPolicy,
} from "./schema";
import { ImageUploadGuide } from "./ImageUploadGuide";
import { PriceOverview } from "./PriceOverview";
import { ParcelSizeSuggestion } from "./ParcelSizeSuggestion";
import { IParcelSuggestion } from "@/types";
import { cn } from "@/lib/utils";
import { TagInput } from "./FormComponent/TagInput";
import InputCharityDonationInput from "./InputCharityDonationInput";
import { useGetCategoryQuery } from "@/redux/api/categoryApi";
import CategorySelector, { Category } from "./Categories/CategorySelector";
import SizeSelector from "./Size/Sizeselector";
import BrandSelector from "./Brand/Brandselector";
import MaterialSelector from "./Material/MaterialSelector";
import { getFirstErrorMessage } from "@/utils/modifyFormError";
import { toast } from "sonner";
import { useGetCharitiesQuery } from "@/redux/api/userApi";
import { formattedData } from "./utils";
import Image from "next/image";
import { useGetSizesQuery } from "@/redux/api/size.api";
import { useGetBrandsQuery } from "@/redux/api/brand.api";
import { useGetMaterialsQuery } from "@/redux/api/material.api";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { AddNewProduct } from "@/lib/Actions/Product.api";
import UpdateShippingAddress from "./UpdateShippingAddress";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { role } from "@/lib/userRole";
import { SuccessModal } from "../../Modal/SuccessModal";
import dynamic from "next/dynamic";
import Link from "next/link";
import DonationAbout from "../../DonationAbout";
import DonationPrivacyAbout from "../../DonationPrivacyAbout";

const ImageEditorModal = dynamic(() => import("../../ImageEditorModal"), {
  ssr: false,
});

const MAX_PHOTOS = 8;
const INPUT_ID = "photo-uploader-input";

export default function AddProductForm() {
  const [images, setImages] = useState<File[]>([]);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  // Image Editor state
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<{
    file: Blob | File;
    index: number | null;
    name?: string;
  } | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  // ======================= category ===========================
  const { data: categoriesData } = useGetCategoryQuery(undefined);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  // ======================= category size ===========================
  const { data: sizeData } = useGetSizesQuery({ categoryId: selectedCategory?.id }, {
    skip: !selectedCategory
  });
  // ======================= category brand ===========================
  const { data: brandData } = useGetBrandsQuery({ categoryId: selectedCategory?.id }, {
    skip: !selectedCategory
  });
  // ======================= category materials ===========================
  const { data: materialData } = useGetMaterialsQuery({ categoryId: selectedCategory?.id }, {
    skip: !selectedCategory
  });
  // =============================== get charities =============================
  const { data: charitiesData } = useGetCharitiesQuery();
  // =============================== product api ==============================
  // const [uploadProduct, { isLoading }] = useCreateProductMutation();

  const isCharityShop = user?.auth?.role === role.CHARITY_SHOP;
  const required_donation = !(user?.auth?.role == role.ECO_FRIENDLY_STORE || isCharityShop);

  const productSchema = useMemo(() => buildProductSchema(required_donation), [required_donation]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: productFormDefaultValues,
  });

  const { isSubmitting: isLoading } = form.formState;

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
      setImages((prev) => [...prev, ...filesToProcess]);
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
      name: (existingFile as File).name || `product-photo-${index + 1}.jpg`,
    });
    setEditorModalOpen(true);
  };

  const handleSaveEditor = useCallback((blob: Blob) => {
    const filename = editingImage?.name || `product-image-${Date.now()}.jpg`;
    const finalFile = new File([blob], filename, { type: blob.type || "image/jpeg" });

    if (editingImage?.index !== null && editingImage?.index !== undefined) {
      // Editing existing image
      setImages((prev) =>
        prev.map((img, i) => (i === editingImage.index ? finalFile : img))
      );
    } else {
      // New single image uploaded
      setImages((prev) => [...prev, finalFile]);
    }

    setEditingImage(null);
    setEditorModalOpen(false);
  }, [editingImage]);

  const handleCloseEditor = useCallback(() => {
    setEditorModalOpen(false);
    setEditingImage(null);
  }, []);

  const removeFile = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Show uploaded images + exactly one empty upload slot (until max is reached)
  const visibleSlots = Math.min(images.length + 1, MAX_PHOTOS);
  const boxes = Array.from({ length: visibleSlots });

  // ====================================== set selected category data ============================
  function handleCategorySelect(cat: Category) {
    setSelectedCategory(cat);
    form.setValue("categoryId", cat.id, { shouldValidate: true });
    form.setValue("sizeId", "", { shouldValidate: false });
    form.setValue("brandId", "", { shouldValidate: false });
    form.setValue("fabric", [], { shouldValidate: false });
  }

  const handleApplySuggestedParcel = (suggestion: IParcelSuggestion) => {
    const heightVal = suggestion.height_cm ?? (suggestion as any).hight_cm;
    form.setValue("weight_kg", String(suggestion.weight_kg), { shouldValidate: true, shouldDirty: true });
    form.setValue("hight_cm", String(heightVal), { shouldValidate: true, shouldDirty: true });
    form.setValue("width_cm", String(suggestion.width_cm), { shouldValidate: true, shouldDirty: true });
    form.setValue("length_cm", String(suggestion.length_cm), { shouldValidate: true, shouldDirty: true });
  };

  const categories = categoriesData?.data || [];
  const sizes = sizeData?.data || [];
  const brands = brandData?.data || [];
  const materials = materialData?.data || [];


  // ===================================== submitting error ===============================
  const onError = (errors: any) => {

    console.log(errors);
    const firstErrorMessage = getFirstErrorMessage(errors);
    toast.error(firstErrorMessage);
  };

  // ====================================== submitting form ===============================
  async function onSubmit(data: ProductFormValues) {
    if (images?.length === 0) {
      toast.error("Please upload at least one product image");
    } else {
      const formData = new FormData();

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      const formattedValues = formattedData(data);

      formData.append("data", JSON.stringify(formattedValues));
      try {
        const res = await AddNewProduct({ payload: formData });
        if (!res.success) {
          throw new Error(res.message);
        }
        form.reset();
        setImages([]);
        setOpenSuccessDialog(true);
        // router.push("/")
      } catch (error: any) {
        toast.error(error?.message || "An error occurred while uploading the product.");
      }
    }
  }

  const watchedPrice = form.watch("price");
  const watchedDiscount = form.watch("discountPct");
  const watchedDonation = form.watch("donation_percent");


  return (
    <div className="md:space-y-6 space-y-3 max-w-2xl mx-auto">
      <h2 className="text-2xl lg:text-3xl font-bold mt-3 md:mt-4 lg:mt-5 py-3 lg:py-4 border-b border-gray-200 text-gray-800">List An Item</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="md:space-y-10 space-y-6"
        >
          {/* ===================================== Product Images ===============================*/}
          <div className="">
            <div className="flex flex-col md:flex-row justify-between items-start gap-3">
              <div>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">Photos</p>
                <p className="text-sm md:text-base mt-1 text-gray-500">Add up to 8 photos in JPEG or PNG format.</p>
              </div>
              <ImageUploadGuide />
            </div>

            <input
              id={INPUT_ID}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={handleFiles}
            />

            <div className="mt-6 grid grid-cols-3 md:grid-cols-4 gap-4">
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

                const isFull = images.length >= MAX_PHOTOS;

                return (
                  <label
                    key={i}
                    htmlFor={INPUT_ID}
                    className="aspect-square rounded border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 transition-all cursor-pointer hover:border-black hover:text-black hover:bg-gray-50"
                  >
                    <Camera size={22} strokeWidth={1.75} />
                    <span className="text-[11px] font-medium mt-1 text-gray-500">
                      {i === 0 ? "Add Photo" : "Add More"}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ===================================== Product Title ================================ */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">Product Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product title"
                    {...field}
                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Description */}
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g. This tops is very smooth and fit..."
                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base px-3"
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ========================================= Product Details Section  ==============================*/}
          <div className="space-y-4">
            <p className="text-lg lg:text-2xl font-bold text-gray-900">
              Product Info
            </p>


            {/* ========================================== product category ================================ */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategorySelector
                      categories={categories}
                      value={selectedCategory?.id}
                      onSelect={handleCategorySelect}
                      placeholder="Select category"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* ========================================= product brand and size ================================ */}
            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 items-start")}>
              <FormItem>
                <FormLabel>Size</FormLabel>
                <SizeSelector
                  control={form.control}
                  sizes={sizes}
                  selectedCategory={selectedCategory}  // null = disabled
                  placeholder="Select size"
                />
              </FormItem>

              <FormItem>
                <FormLabel>Brand</FormLabel>
                <BrandSelector
                  control={form.control}
                  brands={brands}
                  selectedCategory={selectedCategory}
                  placeholder="Select brand"
                />
              </FormItem>
            </div>

            <div className="grid grid-cols-2 md:gap-x-4 gap-x-2 items-start">

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Type and press Enter..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Materials</FormLabel>
                <MaterialSelector
                  control={form.control}
                  materials={materials}
                  selectedCategory={selectedCategory}
                  placeholder="Select materials"
                />
              </FormItem>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setShowCustomPicker(true);
                        } else {
                          setShowCustomPicker(false);
                          field.onChange(value);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-200 rounded shadow-none focus-visible:border-primary-black focus-visible:ring-0 focus:ring-0 focus:border focus-within:border-primary-black text-base py-5 px-3 w-full cursor-pointer">
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[400px] !rounded-none !p-0">
                        {colors.map((color) => (
                          <SelectItem key={color.name} value={color.name} className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <div
                                className="size-5 rounded-full border border-border "
                                style={{
                                  background:
                                    color.name === "Multi"
                                      ? "linear-gradient(90deg, #FF0000, #00FF00, #0000FF)"
                                      : color.hex,
                                  border:
                                    color.name === "White" ||
                                      color.name === "Clear"
                                      ? "1px solid #e5e5e5"
                                      : "none",
                                }}
                              />
                              <span className="text-lg">{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <div className="size-5 rounded-full border border-border bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
                            <span className="text-lg">
                              Select Custom Color
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {showCustomPicker && (
                      <div className="mt-2 md:space-y-2 space-y-1">
                        <FormControl>
                          <Input
                            type="color"
                            {...field}
                            className="bg-[#f2f2f2] h-12 cursor-pointer"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Selected: {field.value || "None"}
                        </p>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ======================================== condition input ============================================== */}
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3 w-full cursor-pointer focus-within:border-primary-black">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="p-0 rounded-none">

                        {conditionOptions.map((option) => (
                          <SelectItem
                            className="rounded-none cursor-pointer py-2.5 px-3 text-base"
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            {!isCharityShop && (
              <>
                {/* ======================================== donation input ============================================== */}
                <div className="space-y-4 mt-16">

                  <div className="flex lg:flex-row flex-col justify-between items-start gap-2 mb-6">
                    <div>
                      <div className="flex flex-row gap-x-0.5 items-center">
                        <p className="text-lg lg:text-2xl font-bold text-gray-900">Donation</p>

                        <DonationAbout />

                      </div>
                      <>
                        <span className="text-xs">
                          {required_donation ? "(Minimum 5% donation required)" : "(Optional donation)"}
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


                  <div className="my-5 space-y-3 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                    <FormField
                      control={form.control}
                      name="donation_percent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donation Percent (%)</FormLabel>
                          <div className="flex items-center bg-white border border-[#e1e1e1] rounded focus-within:border-primary-black">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="flex-1 border-0 shadow-none rounded focus-visible:ring-0 focus:ring-0 !text-base !py-5 px-3 cursor-pointer">
                                  <SelectValue placeholder="Select Donation Percent" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-none p-0">
                                
                                {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map((item) => (
                                  <SelectItem
                                    value={item.toString()}
                                    key={item}
                                    className="rounded-none cursor-pointer"
                                  >
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <span className="pr-3 text-lg text-primary-black pointer-events-none select-none">
                              %
                            </span>
                          </div>
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
                    name="donationPrivacy"
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
              </>
            )}


          </div>

          {/* ============Price================ */}
          <div className="space-y-4 mt-10">
            <p className="text-lg lg:text-2xl font-bold text-gray-900">Price</p>

            {/* ========================================= Price and Discount ============================== */}
            <div className="grid grid-cols-2 md:gap-x-4 gap-x-2 items-start">

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Price ($)</FormLabel>
                    <FormControl>
                      <InputGroup className="bg-white border-[#e1e1e1] rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black !py-5">
                        <InputGroupInput type="number" placeholder="eg: 100" {...field} className="!text-base" />
                        <InputGroupAddon align={"inline-start"} className="text-primary-black text-lg" >
                          $
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>

                      <InputGroup className="bg-white border-[#e1e1e1] rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black !py-5">
                        <InputGroupInput type="number" placeholder="eg: 10" {...field} className="!text-base" />
                        <InputGroupAddon align={"inline-end"} className="text-primary-black text-lg" >
                          %
                        </InputGroupAddon>
                      </InputGroup>

                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Write a discount percentage you want to offer on this product.
                    </p>
                  </FormItem>
                )}
              />



            </div>

            {/* Price Overview: Buyer Price, Charity Donation, and Net Seller Earnings */}
            <PriceOverview
              price={watchedPrice}
              discountPct={watchedDiscount}
              donationPercent={isCharityShop ? 0 : watchedDonation || 0}
            />
          </div>


          {/* ============Shipment================ */}

          <div className="space-y-3 mt-12">
            <p className="text-lg lg:text-2xl font-bold text-gray-900">Shipping</p>
            <UpdateShippingAddress />

            <div className="mt-8">
              <p className="text-lg lg:text-xl font-semibold text-gray-900 mb-5">Parcel Size</p>

              <ParcelSizeSuggestion
                categoryId={selectedCategory?.id || form.watch("categoryId")}
                categoryName={selectedCategory?.name}
                onApply={handleApplySuggestedParcel}
              />

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

          {/* ============ Return Window & Allow Offer ================ */}
          <div className="space-y-4 mt-12">
            <div>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">Offers & Returns</p>
              <p className="text-sm text-gray-500 mt-1">
                Configure your return window and whether buyers can send price offers on this listing.
              </p>
            </div>

            <div className="space-y-5 pt-1">
              <FormField
                control={form.control}
                name="returnsPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Window</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3 w-full cursor-pointer focus-within:border-primary-black">
                          <SelectValue placeholder="Select return window" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="p-0 rounded-none">
                        {returnsPolicy.map((option) => (
                          <SelectItem
                            className="rounded-none cursor-pointer py-2.5 px-3 text-base"
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowOffers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded border border-[#e1e1e1] bg-white px-4 py-3.5">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium text-gray-900 cursor-pointer">
                        Allow buyer to make an offer
                      </FormLabel>
                      <p className="text-xs text-gray-500">
                        Let interested buyers propose a price for this item.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>


          <div className="flex gap-4">
            <Button disabled={isLoading} type="submit" variant={"default"} className="flex-1 group cursor-pointer rounded-none py-6">
              {isLoading ? <span className="loader" /> : "Ready to Submit"}
            </Button>
          </div>
        </form>
      </Form>


      <SuccessModal
        open={openSuccessDialog}
        setOpen={setOpenSuccessDialog}
        content={
          <div className="p-6 sm:p-8">

            {/* Icon with soft glow background */}
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-green-50">
                <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-40" />
                <CheckCircle2
                  className="w-11 h-11 text-green-500 relative"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Heading */}
            <p className="text-center text-2xl font-semibold text-gray-900 leading-snug mb-2">
              Listing Published!
            </p>

            {/* Subtext */}
            <p className="text-center text-sm text-gray-500 leading-relaxed mb-8 max-w-xs mx-auto">
              Your item has been listed successfully and is now visible to buyers.
            </p>

          </div>
        }
      />

      <ImageEditorModal
        isOpen={editorModalOpen}
        onClose={handleCloseEditor}
        image={editingImage?.file ?? null}
        onSave={handleSaveEditor}
      />
    </div>
  );
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
          alt={`Product photo ${index + 1}`}
          className="w-full h-full object-cover "
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
        className=" text-white px-2.5 py-1 text-xs font-medium flex items-center gap-1 shadow-md transition-transform cursor-pointer absolute bottom-0 left-0 bg-black/70 w-full justify-center"
        title="Edit photo"
      >
        <Pencil size={12} strokeWidth={2} />
        <span>Adjust Photo</span>
      </button>


    </div>
  );
}

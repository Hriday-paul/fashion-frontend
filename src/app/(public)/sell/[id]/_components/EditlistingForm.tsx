"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X, Camera } from "lucide-react";
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
    colors,
    conditionOptions,
    productFormSchema,
    ProductFormValues,
    returnsPolicy,
} from "@/components/shared/UserProfile/AddProduct/schema";
import { PriceOverview } from "@/components/shared/UserProfile/AddProduct/PriceOverview";
import { ParcelSizeSuggestion } from "@/components/shared/UserProfile/AddProduct/ParcelSizeSuggestion";
import { IParcelSuggestion } from "@/types";
import { cn } from "@/lib/utils";
import { useGetCategoryQuery } from "@/redux/api/categoryApi";

import { getFirstErrorMessage } from "@/utils/modifyFormError";
import { toast } from "sonner";
import { useGetCharitiesQuery } from "@/redux/api/userApi";

import Image from "next/image";
import { useGetSizesQuery } from "@/redux/api/size.api";
import { useGetBrandsQuery } from "@/redux/api/brand.api";
import { useGetMaterialsQuery } from "@/redux/api/material.api";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { IProduct, IProductImage } from "@/types";
import { Category } from "@/components/shared/UserProfile/AddProduct/Categories/CategoryFilterSelector";
import { ImageUploadGuide } from "@/components/shared/UserProfile/AddProduct/ImageUploadGuide";
import CategorySelector from "@/components/shared/UserProfile/AddProduct/Categories/CategorySelector";
import SizeSelector from "@/components/shared/UserProfile/AddProduct/Size/Sizeselector";
import BrandSelector from "@/components/shared/UserProfile/AddProduct/Brand/Brandselector";
import MaterialSelector from "@/components/shared/UserProfile/AddProduct/Material/MaterialSelector";
import { TagInput } from "@/components/shared/UserProfile/AddProduct/FormComponent/TagInput";
import { formattedData } from "@/components/shared/UserProfile/AddProduct/utils";
import InputCharityDonationInput from "@/components/shared/UserProfile/AddProduct/InputCharityDonationInput";
import UpdateShippingAddress from "@/components/shared/UserProfile/AddProduct/UpdateShippingAddress";
import DonationAbout from "@/components/shared/DonationAbout";
import DonationPrivacyAbout from "@/components/shared/DonationPrivacyAbout";

const MAX_PHOTOS = 8;
const INPUT_ID = "photo-uploader-input";

// A slot in the photo grid is either an already-uploaded image (existing)
// or a freshly-picked File the user just added (new).
type ExistingSlot = { kind: "existing"; image: IProductImage };
type NewSlot = { kind: "new"; file: File };
type PhotoSlot = ExistingSlot | NewSlot;

// ---- Maps an IProduct into the form's default values. ----
// Adjust the right-hand sides to match your actual IProduct field names.
function getDefaultValues(product: IProduct): ProductFormValues {
    return {
        title: product.title ?? "",
        productDescription: product.description ?? "",
        categoryId: product.categoryId ?? product.category?.id ?? "",
        sizeId: product.size?.id ?? product.sizeId ?? "",
        brandId: product.brand?.id ?? product.brandId ?? "",
        tags: product.tags ?? [],
        fabric: product?.meterials ?? [],
        color: product.color ?? "",
        condition: product.condition ?? "",
        donation_percent: product?.donation_percent
            ? String(product.donation_percent)
            : "",
        charities: product.charities?.map((c) => c?.charityId) ?? [],
        donationPrivacy: product?.donationAnonymous,
        price: product.price != null ? String(product.price) : "",
        discountPct: product.discountPct != null ? String(product.discountPct) : "0",
        weight_kg: product.weight_kg != null ? String(product.weight_kg) : "",
        hight_cm: product.hight_cm != null ? String(product.hight_cm) : "",
        width_cm: product.width_cm != null ? String(product.width_cm) : "",
        length_cm: product.length_cm != null ? String(product.length_cm) : "",
        returnsPolicy: product.return_window != null ? String(product.return_window) : "",
        allowOffers: product.allow_offer ?? true,
    };
}

function EditlistingForm({ product }: { product: IProduct }) {

    // Photo grid state: existing product images + newly added files, in one ordered list.
    const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>(
        () => (product.images ?? []).map((image) => ({ kind: "existing", image } as PhotoSlot))
    );
    // Track ids of existing images the user removed, so we can tell the backend to delete them.
    const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

    const [showCustomPicker, setShowCustomPicker] = useState(
        () => !!product.color && !colors.some((c) => c.name === product.color)
    );

    // ======================= category ===========================
    const { data: categoriesData } = useGetCategoryQuery(undefined);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        product.category ? (product.category as unknown as Category) : null
    );

    // ======================= category size ===========================
    const { data: sizeData } = useGetSizesQuery(
        { categoryId: selectedCategory?.id },
        { skip: !selectedCategory }
    );
    // ======================= category brand ===========================
    const { data: brandData } = useGetBrandsQuery(
        { categoryId: selectedCategory?.id },
        { skip: !selectedCategory }
    );
    // ======================= category materials ===========================
    const { data: materialData } = useGetMaterialsQuery(
        { categoryId: selectedCategory?.id },
        { skip: !selectedCategory }
    );
    // =============================== get charities =============================
    const { data: charitiesData } = useGetCharitiesQuery();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: getDefaultValues(product),
    });

    const { isSubmitting: isLoading } = form.formState;

    // If `selectedCategory` wasn't resolvable from `product.category` alone
    // (e.g. only categoryId was on the product), backfill it once the
    // categories list loads, so CategorySelector shows the right value.
    useEffect(() => {
        if (selectedCategory || !categoriesData?.data) return;
        const match = findCategoryById(categoriesData.data, product.categoryId);
        if (match) setSelectedCategory(match);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriesData]);

    function findCategoryById(list: Category[], id?: string): Category | null {
        if (!id) return null;
        for (const cat of list) {
            if (cat.id === id) return cat;
            const child = findCategoryById((cat as any).children ?? [], id);
            if (child) return child;
        }
        return null;
    }

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const incoming = Array.from(e.target.files || []).filter(
            (f) => f.type === "image/jpeg" || f.type === "image/png"
        );
        if (incoming.length > 0) {
            setPhotoSlots((prev) => {
                const room = MAX_PHOTOS - prev.length;
                const newSlots: PhotoSlot[] = incoming
                    .slice(0, Math.max(room, 0))
                    .map((file) => ({ kind: "new", file }));
                return [...prev, ...newSlots];
            });
        }
        e.target.value = "";
    };

    const removeSlot = (index: number) => {
        setPhotoSlots((prev) => {
            const slot = prev[index];
            if (slot.kind === "existing") {
                setRemovedImageIds((ids) => [...ids, slot.image.id]);
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const visibleSlots = Math.min(photoSlots.length + 1, MAX_PHOTOS);
    const boxes = Array.from({ length: visibleSlots });

    function handleCategorySelect(cat: Category) {
        setSelectedCategory(cat);
        form.setValue("categoryId", cat.id, { shouldValidate: true });
        // Category changed -> previously selected size/brand/materials may no longer be valid
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
        toast.success("Applied suggested parcel size");
    };

    const categories = categoriesData?.data || [];
    const sizes = sizeData?.data || [];
    const brands = brandData?.data || [];
    const materials = materialData?.data || [];

    const onError = (errors: any) => {
        console.log(errors);
        const firstErrorMessage = getFirstErrorMessage(errors);
        toast.error(firstErrorMessage);
    };

    async function onSubmit(data: ProductFormValues) {
        if (photoSlots.length === 0) {
            toast.error("Please upload at least one product image");
            return;
        }

        const formData = new FormData();

        const newFiles = photoSlots.filter(
            (s): s is NewSlot => s.kind === "new"
        );
        newFiles.forEach((slot) => formData.append("images", slot.file));

        // Ids of existing images kept, in their current order — useful if
        // your backend wants to preserve/reorder the gallery.
        const keptImageIds = photoSlots
            .filter((s): s is ExistingSlot => s.kind === "existing")
            .map((s) => s.image.id);

        const formattedValues = formattedData(data);

        formData.append(
            "data",
            JSON.stringify({
                ...formattedValues,
                keptImageIds,
                removedImageIds,
            })
        );

        try {
            // await UpdateProduct({ id: product.id, payload: formData });
            toast.success("Product updated successfully!");
        } catch (error: any) {
            toast.error(error?.message || "An error occurred while updating the product.");
        }
    }

    const watchedPrice = form.watch("price");
    const watchedDiscount = form.watch("discountPct");
    const watchedDonation = form.watch("donation_percent");

    return (
        <div className="md:space-y-6 space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold mt-3 md:mt-4 lg:mt-5 py-3 lg:py-4 border-b border-gray-200 text-gray-800">
                Update Listing
            </h2>

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
                                <p className="text-sm md:text-base mt-1 text-gray-500">
                                    Add up to 8 photos in JPEG or PNG format.
                                </p>
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
                                const slot = photoSlots[i];

                                if (slot) {
                                    const src =
                                        slot.kind === "existing"
                                            ? slot.image.url
                                            : URL.createObjectURL(slot.file);

                                    return (
                                        <div
                                            key={slot.kind === "existing" ? slot.image.id : `new-${i}`}
                                            className="group relative aspect-square rounded-lg border border-dashed border-gray-300 overflow-hidden"
                                        >
                                            <Image
                                                src={src}
                                                alt="Product photo"
                                                className="w-full h-full object-cover"
                                                height={500}
                                                width={500}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSlot(i)}
                                                className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity cursor-pointer"
                                                aria-label="Remove photo"
                                            >
                                                <X size={12} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    );
                                }

                                const isFull = photoSlots.length >= 8;

                                return (
                                    <label
                                        key={i}
                                        htmlFor={INPUT_ID}
                                        className="aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 transition-colors cursor-pointer hover:border-gray-400 hover:bg-gray-50 hover:text-gray-500"
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
                                <FormLabel className="text-base font-semibold text-gray-900">
                                    Product Title
                                </FormLabel>
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
                                <FormLabel className="text-base font-semibold text-gray-900">
                                    Product Description
                                </FormLabel>
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
                        <p className="text-lg lg:text-2xl font-bold text-gray-900">Product Info</p>

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

                        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 items-start")}>
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <SizeSelector
                                    control={form.control}
                                    sizes={sizes}
                                    selectedCategory={selectedCategory}
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
                                            value={
                                                showCustomPicker
                                                    ? "custom"
                                                    : field.value || undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white border-gray-200 rounded shadow-none focus-visible:border-primary-black focus-visible:ring-0 focus:ring-0 focus:border focus-within:border-primary-black text-base py-5 px-3 w-full cursor-pointer">
                                                    <SelectValue placeholder="Select a color" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[400px] !rounded-none !p-0">
                                                {colors.map((color) => (
                                                    <SelectItem
                                                        key={color.name}
                                                        value={color.name}
                                                        className="cursor-pointer"
                                                    >
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
                                                        <span className="text-lg">Select Custom Color</span>
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
                                                        onChange={(e) => field.onChange(e.target.value)}
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

                            <FormField
                                control={form.control}
                                name="condition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Condition</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
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

                        <div className="space-y-4 mt-12">
                            <div>
                                <div className="flex flex-row gap-x-0.5 items-center">
                                    <p className="text-lg lg:text-2xl font-bold text-gray-900">Donation</p>

                                    <DonationAbout />

                                </div>
                                <span className="text-xs">(Minimum 5% donation required)</span>
                            </div>

                            <div className="my-5 space-y-3 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                                <FormField
                                    control={form.control}
                                    name="donation_percent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Donation Percent (%)</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3 w-full cursor-pointer">
                                                            <SelectValue placeholder="Select Donation Percent" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-none p-0">
                                                        {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map(
                                                            (item) => (
                                                                <SelectItem
                                                                    value={item.toString()}
                                                                    key={item}
                                                                    className="rounded-none cursor-pointer"
                                                                >
                                                                    {item}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <InputCharityDonationInput
                                    charities={charitiesData?.data || []}
                                    form={form}
                                    name="charities"
                                />
                            </div>
                        </div>

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
                                                value={field.value ? "true" : "false"}
                                                className="flex flex-col md:space-y-1"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={"true"} id="anonymous" />
                                                    <label htmlFor="anonymous" className="text-sm">
                                                        Yes, keep my donation anonymous
                                                    </label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={"false"} id="show-name" />
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
                    </div>

                    {/* ============Price================ */}
                    <div className="space-y-4 mt-10">
                        <p className="text-lg lg:text-2xl font-bold text-gray-900">Price</p>

                        <div className="grid grid-cols-2 md:gap-x-4 gap-x-2 items-start">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Price ($)</FormLabel>
                                        <FormControl>
                                            <InputGroup className="bg-white border-[#e1e1e1] rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black !py-5">
                                                <InputGroupInput type="number" step="any" placeholder="eg: 100" {...field} className="!text-base" />
                                                <InputGroupAddon align={"inline-start"} className="text-primary-black text-lg">
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
                                            <Input
                                                placeholder="Enter discount percentage"
                                                {...field}
                                                type="number"
                                                className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3"
                                            />
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
                            donationPercent={watchedDonation}
                        />
                    </div>

                    {/* ============Shipment================ */}
                    <div className="space-y-3 mt-12">
                        <p className="text-lg lg:text-2xl font-bold text-gray-900">Shipping</p>
                        <UpdateShippingAddress />

                        <div className="mt-8">
                            <p className="text-lg lg:text-xl font-semibold text-gray-900 mb-5">Parcel Size</p>

                            <ParcelSizeSuggestion
                                categoryId={selectedCategory?.id || form.watch("categoryId") || product?.categoryId}
                                categoryName={selectedCategory?.name}
                                onApply={handleApplySuggestedParcel}
                            />

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
                                                    <InputGroupAddon align={"inline-end"} className="text-primary-black text-lg">
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
                                                    <InputGroupAddon align={"inline-end"} className="text-primary-black text-lg">
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
                                                    <InputGroupAddon align={"inline-end"} className="text-primary-black text-lg">
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
                                                    <InputGroupAddon align={"inline-end"} className="text-primary-black text-lg">
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
                        <Button
                            disabled={isLoading}
                            type="submit"
                            variant={"default"}
                            className="flex-1 group cursor-pointer rounded-none py-5"
                        >
                            {isLoading ? <span className="loader" /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default EditlistingForm;

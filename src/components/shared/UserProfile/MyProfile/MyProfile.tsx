"use client"
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Camera, X, CheckCircle2, Phone } from 'lucide-react';
import { PhoneVerificationModal } from './PhoneVerificationModal';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IUser, UserRole } from '@/types';
import Image from 'next/image';
import { defaultImg } from '@/utils/defaultImg';
import { UpdateProfile } from '@/lib/Actions/Profile.action';
import userBannerPlaceholder from "@/assets/banner/user-placeholder.png";
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import profileUpdateSchema, { charitySchema } from './Schema';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Info } from "lucide-react";
import { cn } from '@/lib/utils';
import SelectCountry from '@/app/(public)/checkout/cart/[cartGroupId]/_components/Billing/SelectCountry';
import { countries } from '@/utils/constant';
import CountrySellNotAvaialbleAlert from '../CountrySellNotAvaialbleAlert';
import { useRouter } from 'next/navigation';

const AboutMe = ({ user }: { user: IUser }) => {
    const role = user?.auth?.role;
    if (role === UserRole.CHARITABLE_ORGANIZATION || role === UserRole.CHARITY_SHOP || role === UserRole.ECO_FRIENDLY_STORE) {
        return "About Organization";
    } else {
        return "About Me";
    }
}


const ImageEditorModal = dynamic(() => import('@/components/shared/ImageEditorModal'), {
    ssr: false,
});

const MAX_PHOTOS = 8;
const INPUT_ID = "photo-uploader-input";
const THUMBNAIL_INPUT_ID = "charity-thumbnail-input";
const BANNER_INPUT_ID = "user-banner-input";

type EditorTarget = "profile" | "thumbnail" | "banner";

function MyProfile({ user }: { user: IUser }) {

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const router = useRouter();

    // Banner
    const [banner, setBanner] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");

    // Charity thumbnail
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

    // Image Editor modal states (shared by profile photo + charity thumbnail)
    const [editorModalOpen, setEditorModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<{
        file: Blob | File;
        name?: string;
        target: EditorTarget;
    } | null>(null);

    const [phone, setPhone] = useState(user?.phone ?? "");
    const [defaultCharityImgs, setDefaultCharityImgs] = useState<{ id: string, url: string }[]>(user?.charityGalleries || []);
    const [charityImgs, setCharityImgs] = useState<File[]>([]);
    const [dltCharityImgIds, setDltCharityImgIds] = useState<string[]>([]);
    const [openPhoneModal, setOpenPhoneModal] = useState(false);

    useEffect(() => {
        setPhone(user?.phone ?? "");
    }, [user?.phone]);

    // Profile photo preview URL (created once per file, revoked on change)
    useEffect(() => {
        if (!image) {
            setImagePreview("");
            return;
        }
        const url = URL.createObjectURL(image);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    // Banner preview URL
    useEffect(() => {
        if (!banner) {
            setBannerPreview("");
            return;
        }
        const url = URL.createObjectURL(banner);
        setBannerPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [banner]);

    // Thumbnail preview URL
    useEffect(() => {
        if (!thumbnail) {
            setThumbnailPreview("");
            return;
        }
        const url = URL.createObjectURL(thumbnail);
        setThumbnailPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [thumbnail]);

    const isCharity = user?.auth?.role == UserRole.CHARITABLE_ORGANIZATION || user?.auth?.role == UserRole.CHARITY_SHOP;

    const profileSchema = isCharity ? profileUpdateSchema.merge(charitySchema) : profileUpdateSchema;

    const country = countries.find((c) => c.code === user?.country)

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.fname ?? "",
            lastName: user?.lname ?? "",
            phoneNumber: user?.phone ?? "",
            bio: user.bio ?? "",
            userName: user?.userName ?? "",
            email: user?.email ?? "",
            website: user?.website ?? "",
            description: user?.description ?? "",
            facebook: user?.facebook ?? "",
            instagram: user?.instagram ?? "",
            twitter: user?.twitter ?? "",
            support_email: user?.support_email ?? "",
            country: country?.name || "",
        },
    });

    const { formState: { isSubmitting: isLoading } } = form;

    const onSubmit = async (data: z.infer<typeof profileSchema>) => {

        try {

            const { firstName, phoneNumber, lastName, country, ...more } = data;

            const countryDetail = countries.find((c) => c.name === country);

            const payload = {
                phone: phoneNumber, fname: firstName, lname: lastName,
                country: countryDetail?.code || "",
                dltGalleries: dltCharityImgIds,
                ...more
            }

            const form = new FormData();

            form.append('data', JSON.stringify(payload))

            if (image) {
                form.append('picture', image);
            }

            if (banner) {
                form.append('banner', banner);
            }

            if (isCharity && thumbnail) {
                form.append('charityThumbnail', thumbnail);
            }

            for (let charityImg of charityImgs) {
                form.append('charityImgs', charityImg);
            }

            const res = await UpdateProfile({ payload: form });
            if (!res.success) {
                throw new Error(res.message);
            }

            toast.success(res.message || "Profile Updated Successfully");

            router.push(`/member/${user?.userName}`);

        } catch (error: any) {
            if (isRedirectError(error)) {
                throw error; // Let Next.js handle the redirect
            }
            toast.error(error?.message || "Failed to update profile");
        }

    };

    const totalCount = defaultCharityImgs.length + charityImgs.length;

    // ---------------- Profile photo ----------------
    const fileonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files as File[] | null;
        if (!fileList || fileList.length === 0) {
            return;
        }
        const file = fileList[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            e.target.value = "";
            return;
        }

        setEditingImage({
            file,
            name: file.name || `profile-${Date.now()}.jpg`,
            target: "profile",
        });
        setEditorModalOpen(true);
        e.target.value = "";
    };

    const handleAdjustPhoto = () => {
        if (!image) return;
        setEditingImage({
            file: image,
            name: image.name,
            target: "profile",
        });
        setEditorModalOpen(true);
    };

    // ---------------- Charity thumbnail ----------------
    const thumbnailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        setEditingImage({
            file,
            name: file.name || `charity-thumbnail-${Date.now()}.jpg`,
            target: "thumbnail",
        });
        setEditorModalOpen(true);
    };

    const handleAdjustThumbnail = () => {
        if (!thumbnail) return;
        setEditingImage({
            file: thumbnail,
            name: thumbnail.name,
            target: "thumbnail",
        });
        setEditorModalOpen(true);
    };

    // ---------------- Banner ----------------
    const bannerOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        setEditingImage({
            file,
            name: file.name || `banner-${Date.now()}.jpg`,
            target: "banner",
        });
        setEditorModalOpen(true);
    };

    const handleAdjustBanner = () => {
        if (!banner) return;
        setEditingImage({
            file: banner,
            name: banner.name,
            target: "banner",
        });
        setEditorModalOpen(true);
    };

    // ---------------- Shared editor handlers ----------------
    const handleSaveEditor = useCallback((blob: Blob) => {
        const isThumb = editingImage?.target === "thumbnail";
        const isBanner = editingImage?.target === "banner";
        const filename =
            editingImage?.name ||
            (isBanner
                ? `banner-${Date.now()}.jpg`
                : isThumb
                    ? `charity-thumbnail-${Date.now()}.jpg`
                    : `profile-${Date.now()}.jpg`);

        const finalFile = new File([blob], filename, {
            type: blob.type || "image/jpeg",
        });

        if (isBanner) {
            setBanner(finalFile);
        } else if (isThumb) {
            setThumbnail(finalFile);
        } else {
            setImage(finalFile);
        }

        setEditingImage(null);
        setEditorModalOpen(false);
    }, [editingImage]);

    const handleCloseEditor = useCallback(() => {
        setEditorModalOpen(false);
        setEditingImage(null);
    }, []);

    // ---------------- Gallery ----------------
    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {

        const incoming = Array.from(e.target.files || []);

        if (incoming.length > 0) {
            setCharityImgs((prev) => {
                const room = MAX_PHOTOS - prev.length;
                return [...prev, ...incoming.slice(0, Math.max(room, 0))];
            });
        }
        // allow re-selecting the same file again later
        e.target.value = "";
    };

    const removeDefaultImg = (id: string) => {
        setDltCharityImgIds((prev) => [...prev, id]);
        setDefaultCharityImgs((prev) => prev.filter((img) => img.id !== id));
    };

    // Removing a freshly-added local file — just drop it from state
    const removeFile = (index: number) => {
        setCharityImgs((prev) => prev.filter((_, i) => i !== index));
    };

    const boxes = Array.from({ length: 8 });

    const isPhoneVerified = user?.auth?.isPhoneVerified;
    const havePhone = user?.phone;

    const isCharityOrg = user?.auth?.role === UserRole.CHARITABLE_ORGANIZATION;
    const isCharityShop = user?.auth?.role === UserRole.CHARITY_SHOP;

    const isCharityEco = user?.auth?.role === UserRole.ECO_FRIENDLY_STORE || isCharityOrg || isCharityShop;

    // Thumbnail shown in the upload box + preview card (new file wins over saved one)
    const thumbnailSrc: string = thumbnailPreview || user?.charityThumbnail?.url || "";

    return (
        <div className="md:space-y-8 space-y-6 max-w-4xl">

            {/* Profile Banner Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">

                    {banner && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setBanner(null)}
                            className="text-xs text-muted-foreground hover:text-destructive h-8 px-2 cursor-pointer"
                        >
                            <X className="size-3.5 mr-1" />
                            Discard Change
                        </Button>
                    )}
                </div>

                <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-xl overflow-hidden bg-muted group">
                    <Image
                        src={bannerPreview || user?.bannerUrl || userBannerPlaceholder}
                        alt="Profile banner"
                        fill
                        priority
                        quality={100}
                        unoptimized={!bannerPreview && !user?.bannerUrl?.trim()}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1400px"
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label htmlFor={BANNER_INPUT_ID} className="cursor-pointer">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-gray-800 text-sm font-medium hover:bg-gray-100 shadow-sm transition">
                                <Camera className="size-4" />
                                {banner || user?.bannerUrl ? "Change Banner" : "Upload Banner"}
                            </span>
                        </label>

                        {banner && (
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleAdjustBanner}
                                className="cursor-pointer text-xs h-9 bg-white/90 hover:bg-white text-gray-800"
                            >
                                Adjust Banner
                            </Button>
                        )}
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-2 group-hover:hidden">
                        <label htmlFor={BANNER_INPUT_ID} className="cursor-pointer">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur shadow-sm transition">
                                <Camera className="size-3.5" />
                                {banner || user?.bannerUrl ? "Change Banner" : "Upload Banner"}
                            </span>
                        </label>
                    </div>
                </div>

                <input
                    id={BANNER_INPUT_ID}
                    name={BANNER_INPUT_ID}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={bannerOnChange}
                />
            </div>

            <div className="flex pb-4">
                <div className="flex items-center gap-4">
                    <Image
                        alt="profile img"
                        className="size-28 object-cover rounded-full"
                        height={1000}
                        width={1000}
                        placeholder='blur'
                        blurDataURL={defaultImg?.placeholderImg}
                        src={imagePreview || user?.picture?.url || defaultImg.empty_user}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <label htmlFor="chosePhoto" className="cursor-pointer">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                                <Camera className="size-4" />
                                Edit Photo
                            </span>
                        </label>

                        {image && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAdjustPhoto}
                                className="cursor-pointer text-xs h-9"
                            >
                                Adjust Photo
                            </Button>
                        )}

                        <input
                            onChange={fileonChange}
                            multiple={false}
                            type="file"
                            name="chosePhoto"
                            id="chosePhoto"
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="md:space-y-8 space-y-6 max-w-4xl">

                    <div>
                        <p className="text-xl font-semibold mb-6">
                            {isCharityOrg ? "Charity Details" : isCharityShop ? "Charity Shop Details" : "User Details"}
                        </p>

                        <div className='space-y-7 max-w-lg mb-8'>
                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="userName"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled
                                                    className="border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-6 px-4 "
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type='email'
                                                    disabled
                                                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-6 px-4"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1">

                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800 font-normal">Phone Number</FormLabel>

                                            {/* Single bordered container */}
                                            <div className="flex items-center gap-2 rounded border border-[#e1e1e1] bg-white pr-2 focus-within:border-neutral-900 transition-colors py-1">
                                                <FormControl>
                                                    <PhoneInput
                                                        // @ts-ignore
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        international
                                                        defaultCountry="US"
                                                        disabled
                                                        className={cn(
                                                            "flex-1",
                                                            // strip inner borders/backgrounds so it looks like one field
                                                            "[&_button]:!border-0 [&_button]:!bg-transparent [&_button]:!shadow-none [&_button]:!rounded-none",
                                                            "[&_input]:!border-0 [&_input]:!bg-transparent [&_input]:!shadow-none [&_input]:!rounded-none"
                                                        )}
                                                    />
                                                </FormControl>

                                                {/* Right side: status icon + button */}
                                                <>
                                                    {!isPhoneVerified && <Info className="size-5 text-yellow-700 shrink-0" />}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setOpenPhoneModal(true)}
                                                        className="h-9 bg-transparent px-4 text-sm rounded font-medium whitespace-nowrap cursor-pointer shadow-none"
                                                    >
                                                        {isPhoneVerified ? "Change Phone" : havePhone ? "Verify Phone" : "Add Phone"}
                                                    </Button>
                                                </>
                                            </div>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <SelectCountry setValue={form.setValue} control={form.control} />

                            {
                                country && !user?.countryAvaialblity && !isCharity && <CountrySellNotAvaialbleAlert currentCountry={country?.name} />
                            }

                        </div>
                    </div>

                    <div className="">
                        <p className="text-xl font-semibold mb-6">
                            <AboutMe user={user} />
                        </p>

                        <div className='space-y-7 max-w-lg'>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>{isCharityEco ? "Organization Name" : "First Name"}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={isCharityEco ? "Enter Organization Name" : "Enter Your First Name"}
                                                    {...field}
                                                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-6 px-4"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {!isCharityEco && <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Your Last Name"
                                                    {...field}
                                                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-6 px-4"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>}

                            {isCharity && <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="support_email"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>Support Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type='email'
                                                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-6 px-4"
                                                    placeholder="Enter Charity Support Email"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>}

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Short Bio..."
                                                    {...field}
                                                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-3 px-4"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>

                        {isCharity && (
                            <div className='mt-8'>

                                <div className='space-y-7 max-w-lg'>

                                    <div className="flex-1">
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem className=''>
                                                    <FormLabel className='text-gray-800 font-normal'>About Charity</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Tell us about your charity..."
                                                            {...field}
                                                            className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-3 px-4"
                                                            rows={5}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* ================= Charity Listing Thumbnail ================= */}
                                    <div>
                                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Charity Listing Thumbnail</h2>
                                        <p className="text-sm mt-1 text-gray-600">
                                            This image will be shown when your charity or charity shop appears on listings and in search results.
                                            Choose a clear image that represents your charity (e.g. logo, store front or charity work).
                                        </p>

                                        <input
                                            id={THUMBNAIL_INPUT_ID}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={thumbnailOnChange}
                                        />

                                        <div className="mt-4 w-72 h-40">
                                            {/* Upload box */}
                                            <div>
                                                {thumbnailSrc ? (
                                                    <div className="relative w-60 h-40 rounded-lg border border-gray-200 overflow-hidden bg-white">
                                                        <Image
                                                            src={thumbnailSrc}
                                                            alt="Charity thumbnail"
                                                            className="w-full h-full object-cover"
                                                            width={800}
                                                            height={600}
                                                            unoptimized
                                                        />
                                                        <div className="absolute bottom-0 left-0 w-full flex bg-black/70 text-white text-xs font-medium">
                                                            <label
                                                                htmlFor={THUMBNAIL_INPUT_ID}
                                                                className="flex-1 flex items-center justify-center gap-1 py-2 cursor-pointer hover:bg-black/80"
                                                            >
                                                                <Camera size={12} />
                                                                Change
                                                            </label>
                                                            {thumbnail && (
                                                                <>
                                                                    <span className="w-px bg-white/30" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={handleAdjustThumbnail}
                                                                        className="flex-1 py-2 cursor-pointer hover:bg-black/80"
                                                                    >
                                                                        Adjust Photo
                                                                    </button>
                                                                    <span className="w-px bg-white/30" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setThumbnail(null)}
                                                                        className="flex-1 py-2 cursor-pointer hover:bg-black/80"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label
                                                        htmlFor={THUMBNAIL_INPUT_ID}
                                                        className="w-60 h-40 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-center px-4 cursor-pointer text-gray-400 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Camera size={24} strokeWidth={1.5} />
                                                        <span className="mt-2 text-sm font-medium text-gray-800">Upload Charity Thumbnail</span>
                                                        <span className="mt-1 text-xs text-gray-500">Recommended size: 800 × 600px</span>
                                                        <span className="text-xs text-gray-500">JPG, PNG or WebP</span>
                                                    </label>
                                                )}
                                            </div>

                                        </div>
                                    </div>

                                    {/* ================= Gallery ================= */}
                                    <div className="">
                                        <div>
                                            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Gallery</h2>
                                            <p className="text-sm mt-1 text-gray-500">Add some photos to your charity's gallery.</p>
                                        </div>

                                        <input
                                            id={INPUT_ID}
                                            type="file"
                                            accept="image/jpeg,image/png"
                                            multiple
                                            className="hidden"
                                            onChange={handleFiles}
                                        />

                                        <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-4">
                                            {boxes.map((_, i) => {
                                                // First show remaining default images
                                                if (i < defaultCharityImgs.length) {
                                                    const img = defaultCharityImgs[i];
                                                    return (
                                                        <div
                                                            key={img.id}
                                                            className="group relative aspect-square rounded-lg border border-dashed border-gray-300 overflow-hidden"
                                                        >
                                                            <Image
                                                                src={img?.url || defaultImg?.placeholderImg}
                                                                alt="Galary photo"
                                                                className="w-full h-full object-cover"
                                                                height={500}
                                                                width={500}
                                                                placeholder='blur'
                                                                blurDataURL={defaultImg?.placeholderImg}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeDefaultImg(img.id)}
                                                                className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity cursor-pointer"
                                                                aria-label="Remove photo"
                                                            >
                                                                <X size={12} strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                    );
                                                }

                                                // Then show newly added local files
                                                const localIndex = i - defaultCharityImgs.length;
                                                const file = charityImgs[localIndex];

                                                if (file) {
                                                    return (
                                                        <div
                                                            key={`local-${localIndex}`}
                                                            className="group relative aspect-square rounded-lg border border-dashed border-gray-300 overflow-hidden"
                                                        >
                                                            <Image
                                                                src={URL.createObjectURL(file)}
                                                                alt="Charity photo"
                                                                className="w-full h-full object-cover"
                                                                height={500}
                                                                width={500}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(localIndex)}
                                                                className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity cursor-pointer"
                                                                aria-label="Remove photo"
                                                            >
                                                                <X size={12} strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                    );
                                                }

                                                // Otherwise, empty upload box
                                                const isFull = totalCount >= MAX_PHOTOS;

                                                return (
                                                    <label
                                                        key={`empty-${i}`}
                                                        htmlFor={isFull ? undefined : INPUT_ID}
                                                        className={`aspect-square rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 transition-colors ${isFull
                                                            ? "opacity-40 cursor-not-allowed"
                                                            : "cursor-pointer hover:border-gray-400 hover:bg-gray-50 hover:text-gray-500"
                                                            }`}
                                                    >
                                                        <Camera size={22} strokeWidth={1.75} />
                                                    </label>
                                                );
                                            })}
                                        </div>

                                    </div>

                                </div>

                            </div>
                        )}

                        <p className="text-xl font-semibold mb-6 mt-8">Socials</p>

                        <div className='space-y-7 max-w-lg'>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>Website</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://...."
                                                    {...field}
                                                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-6 px-4"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="facebook"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>Facebook</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://facebook.com/..."
                                                    {...field}
                                                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-6 px-4"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="instagram"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>Instagram</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://instagram.com/..."
                                                    {...field}
                                                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-6 px-4"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="twitter"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800 font-normal'>Twitter(X)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://x.com/..."
                                                    {...field}
                                                    className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black !text-base !py-6 px-4"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>

                    </div>

                    <Button size={"lg"} type='submit' className="cursor-pointer gap-2 disabled:cursor-not-allowed rounded-none mt-5" disabled={isLoading}>
                        {isLoading ? <span className="loader" /> : "Save Changes "}
                    </Button>

                </form>
            </Form>

            <PhoneVerificationModal
                open={openPhoneModal}
                onOpenChange={setOpenPhoneModal}
                currentPhone={phone}
                title={isPhoneVerified ? "Change Phone Number" : havePhone ? "Verify Phone Number" : "Add Phone Number"}
            />

            <ImageEditorModal
                isOpen={editorModalOpen}
                onClose={handleCloseEditor}
                image={editingImage?.file ?? null}
                onSave={handleSaveEditor}
            />

        </div>
    )
}

export default MyProfile
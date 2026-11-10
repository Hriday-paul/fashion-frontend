import GetUserDetails from '@/lib/services/UserDetails';
import { IUser } from '@/types';
import { defaultImg } from '@/utils/defaultImg';
import { BookImage, File, Heart, LucideIcon, Shirt } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

import {
    Globe,
    Facebook,
    Instagram,
    Twitter,
} from "lucide-react";
import ClothesDonationDialog from '@/components/shared/Modal/clothesDonation/ClothesDonationDialog';
import { DonationFromProfile } from '../../_components/DonationFromProfile';

async function CharityDetails({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const user = GetUserDetails({ userName: username });

    return (
        <div>
            <Suspense fallback={<div className="flex-center h-28 lg:h-40">
                <span className="loaderDark !w-10"> </span>
            </div>}>
                <OverViewDetails userPromise={user} />
            </Suspense>
        </div>
    )
}

export default CharityDetails;

const OverViewDetails = async ({ userPromise }: { userPromise: Promise<{ data: { user: IUser } }> }) => {

    const userD = await userPromise;


    if (!userD?.data?.user) {
        return notFound()
    }

    const user = {
        data: userD?.data?.user
    }

    return <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16'>

        <div className='order-2 col-span-1 space-y-4 md:space-y-4 lg:space-y-5'>

            <div className="rounded-xl bg-[#0f172a] text-white p-5 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1 font-semibold">Ready to give?</div>
                <div className="text-lg font-bold mb-1 leading-tight" style={{ textWrap: "pretty" }}>100% goes to this charity</div>
                <p className="text-[12.5px] text-white mb-4 leading-relaxed">FASHION doesn't take a cut. Donate directly from this page.</p>

                <DonationFromProfile charity={user?.data}>
                    <button className="text-center w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#0f172a] font-bold py-2.5 rounded-lg text-sm cursor-pointer flex justify-center items-center gap-1.5">
                        <Heart size={20} />
                        Make your donation
                    </button>
                </DonationFromProfile>
            </div>

            <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-bold uppercase tracking-widest text-black">
                    Donate clothes
                </p>

                <div className="mt-2 flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-200">
                        <Shirt className="h-7 w-7 text-slate-800" strokeWidth={2} />
                    </div>

                    <div className="flex-1">
                        <p className="text-sm leading-snug text-indigo-800">
                            Give your pre-loved clothes a new home and support this charity.
                        </p>
                        <ClothesDonationDialog charityId={user?.data?.id}>
                            <button
                                type="button"
                                className="mt-2 w-full rounded-md border border-black bg-white px-4 py-1.5 text-sm text-black transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 font-semibold cursor-pointer"
                            >
                                Donate clothes
                            </button>
                        </ClothesDonationDialog>
                    </div>
                </div>
            </section>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-bold uppercase tracking-widest text-black mb-3">
                    Socials
                </p>
                <ul className="space-y-4">
                    <SocialRow
                        icon={Globe}
                        value={user?.data?.website}
                        href={user?.data?.website}
                        placeholder="Website not added yet"
                    />

                    <SocialRow icon={Facebook} value={user?.data?.facebook} href={user?.data?.facebook} placeholder="Facebook not added yet" />

                    {user?.data?.instagram && (
                        <SocialRow icon={Instagram} value={user?.data?.instagram} href={user?.data?.instagram} placeholder="Instagram not added yet" />
                    )}
                    {user?.data?.twitter && (
                        <SocialRow icon={Twitter} value={user?.data?.twitter} href={user?.data?.twitter} placeholder="Twitter not added yet" />
                    )}
                </ul>
            </div>

            {user?.data?.support_email && <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
                    Inquiries
                </h2>
                <Link
                    href={`mailto:${user?.data?.support_email}`}
                    className="text-lg font-medium border-b border-black/10 pb-1 hover:border-brand transition-colors"
                >
                    {user?.data?.support_email}
                </Link>
            </div>}

        </div>

        <div className='order-1 col-span-1 md:col-span-2 space-y-5 md:space-y-8'>

            <section className='border border-gray-200 rounded-md p-4'>
                <h2 className="text-xl font-semibold text-foreground">About</h2>
                {user?.data?.description ? <div className="mt-3 space-y-4 text-base leading-relaxed text-gray-800">
                    <p>
                        {user?.data?.description}
                    </p>
                </div> : <div className="flex flex-col items-center px-4 pb-4 pt-1 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                        <File className="h-7 w-7 text-slate-800" />
                    </div>

                    <p className="mt-4 text-base lg:text-lg font-semibold text-black">Does not add yet</p>
                    <p className="mt-1 text-sm text-gray-600">
                        This charity shop hasn’t added a description yet.
                    </p>
                </div>}

            </section>

            <section className='border border-gray-200 rounded-md p-4'>
                <h2 className="text-xl font-semibold text-foreground">Gallery</h2>
                {/* <p className="mt-1 text-sm text-gray-700">
                    Moments from our recent programmes on the ground.
                </p> */}
                {user?.data?.charityGalleries.length > 0 ? <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {user?.data?.charityGalleries?.map((image) => (
                        <Image
                            src={image.url || defaultImg?.placeholderImg}
                            key={image?.id}
                            alt={image?.caption || `Gallery Image`}
                            placeholder='blur'
                            blurDataURL={defaultImg?.placeholderImg}
                            width={1024}
                            height={768}
                            className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ))}
                </div> : <div className="flex flex-col items-center px-4 pb-4 pt-1 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                        <BookImage className="h-7 w-7 text-slate-800" />
                    </div>

                    <p className="mt-4 text-base lg:text-lg font-semibold text-black">No photos yet</p>
                    <p className="mt-1 text-sm text-gray-600">
                        This charity shop hasn’t added any photos yet.
                    </p>
                </div>}
            </section>

        </div>

    </div>
}

type DetailRowProps = {
    icon: LucideIcon;
    value?: string | null;
    placeholder?: string;
    href?: string | null;
};

function SocialRow({ icon: Icon, value, placeholder, href }: DetailRowProps) {
    return (
        <li className="flex items-center gap-4">
            <Icon className="h-5 w-5 shrink-0 text-black" strokeWidth={2} />

            {value && href ? (
                <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-800 transition-colors hover:text-brand hover:underline"
                >
                    {value}
                </Link>
            ) : value ? (
                <span className="text-sm font-medium text-indigo-800">{value}</span>
            ) : (
                <span className="text-sm text-indigo-800">{placeholder}</span>
            )}
        </li>
    );
}

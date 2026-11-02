"use client"
import { useSellerSellCharitySupportStatsQuery } from '@/redux/api/donation.api'
import { defaultImg } from '@/utils/defaultImg';
import { ChevronRight, HandHeart, HeartHandshake, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className='border-x border-zinc-200 px-5 md:px-6 lg:px-7'>
            <dt className="sr-only">{label}</dt>
            <dd className="text-lg font-semibold text-foreground">{value}</dd>
            <span className="text-sm text-muted-foreground">{label}</span>
        </div>
    );
}

function SupportStats({ userName }: { userName: string }) {

    const { isLoading, data, isSuccess } = useSellerSellCharitySupportStatsQuery({ userName }, { refetchOnMountOrArgChange: true });

    if (isLoading) {
        return <div className="flex-center h-40 lg:h-60">
            <span className="loaderDark !w-10"> </span>
        </div>
    }

    return (
        <div className='space-y-5'>
            <section className="rounded-xl border border-border bg-green-300/5 p-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-green-600/10 text-brand-foreground">
                            <HeartHandshake className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Giving Back</h2>
                            <p className="max-w-xl text-sm text-muted-foreground">
                                {userName} donates a share of every sale to verified charities.
                                Buying from this seller supports these causes directly.
                            </p>
                        </div>
                    </div>
                    <div className="flex">
                        <Stat value={`$${data?.data?.sellDonatedAmount?.toFixed(2) || 0}`} label="Total donated" />
                        <Stat value={`${data?.data?.avgSellDonationPercentage.toFixed(1) || 0}%`} label="Pledged avg listing" />
                        <Stat value={`${data?.data?.totalCharitiesToSupport || 0}`} label="Charities Supported" />
                    </div>
                </div>
            </section>

            {(isSuccess && data?.data?.donationsByCharity.length > 0) ? <div>
                <div className="mb-4 flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Supported charities</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data?.data?.donationsByCharity?.map((c) => (
                        <div key={c?.charityId} className='border border-gray-200 p-4 rounded-md'>
                            <div className="flex items-center gap-4 ">
                                <Image
                                    src={c?.charityImage || defaultImg?.product}
                                    alt={`${c?.charityName} logo`}
                                    height={600}
                                    width={800}
                                    className="h-16 w-24 rounded-md object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="truncate text-sm font-semibold text-foreground">
                                        {c?.fname} {c?.lname}
                                    </h4>
                                    <Link
                                        href={`/member/${c?.userName}`}
                                        className="mt-0.5 inline-flex items-center underline text-sm text-green-700"
                                    >
                                        View Charity
                                        <ChevronRight className="size-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-2 mt-2'>
                                <div className="border-r border-gray-300">
                                    <p className="text-lg font-bold tabular-nums text-gray-900">
                                        ${c?.totalDonation?.toFixed(2) || 0}
                                    </p>
                                    <div className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                                        <span>Donated so far</span>

                                        {/* Info tooltip (CSS only) */}
                                        <span className="group relative inline-flex">
                                            <button
                                                type="button"
                                                aria-label="How donations are counted"
                                                className="rounded-full text-gray-400 outline-none hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-gray-400"
                                            >
                                                <Info size={16} />
                                            </button>
                                            <span
                                                role="tooltip"
                                                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-md bg-primary-black px-3 py-2 text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                                            >
                                                Only includes donations that have been paid out
                                                to the charity.
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <div className='pl-6'>
                                    <p className="text-lg font-bold tabular-nums text-gray-900">
                                        {c?.productsSupported || 0}
                                    </p>
                                    <div className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                                        <span>Listings supported</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> : <div className="py-20 md:py-24 lg:py-28 max-w-md mx-auto">
                <div className='bg-green-600/10 p-3 h-20 w-20 flex-center rounded-full mx-auto'>
                    <HandHeart size={45} />
                </div>

                <p className="text-center text-gray-900 font-semibold text-base md:text-xl lg:text-2xl mb-2">No charity support yet</p>

                <p className="text-center text-gray-600 text-sm lg:text-base">This seller hasn't selected a charity for any listings yet. When they choose to donate a percentage of their sales, it will appear here and help support verified charities.</p>

                <Link href={`/help/charity-support`} className='flex flex-row gap-x-1 items-center underline text-gray-700 justify-center mt-2'>
                    <p>Learn more</p>
                    <Info size={16} />
                </Link>
            </div>}






        </div>
    )
}

export default SupportStats
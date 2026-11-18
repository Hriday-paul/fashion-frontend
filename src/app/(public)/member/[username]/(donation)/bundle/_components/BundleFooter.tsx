"use client"
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSingleSellerCartItemsQuery } from '@/redux/api/cart.api'
import { defaultImg } from '@/utils/defaultImg';
import { Package } from 'lucide-react'
import Image from 'next/image';
import React from 'react'
import FormatCurrency from "@/components/shared/FormatCurrency";
import ReviewBundleModal from './ReviewBundleModal';

function BundleFooter({ userName }: { userName: string }) {

    const [openReviewBundleModal, setOpenReviewBundleModal] = React.useState(false);

    const { isLoading, isSuccess, isError, data, isFetching } = useGetSingleSellerCartItemsQuery({ sellerUserName: userName });

    return (
        isSuccess && <div className="fixed bottom-0 z-30 border-t bg-card/85 backdrop-blur-xl w-full border-zinc-200">
            <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5">

                {
                    isFetching ? <div className='flex flex-row gap-x-1'>
                        <div className='flex flex-row gap-x-1 items-center'>
                            <Skeleton className="h-16 w-16 rounded-lg" />
                            <Skeleton className="h-16 w-16 rounded-lg" />
                            <Skeleton className="h-16 w-16 rounded-lg" />
                        </div>

                        <div className='space-y-1'>
                            <Skeleton className="h-3 w-32 rounded-lg" />
                            <Skeleton className="h-4 w-16 rounded-lg" />
                        </div>
                    </div> : <div className="flex min-w-0 items-center gap-4">
                        {data?.data?.items?.length > 0 ? (
                            <div className="flex shrink-0 -space-x-3">
                                {data?.data?.items?.slice(0, 4).map((item) => (
                                    <Image
                                        key={item?.id}
                                        src={item?.product?.images?.[0]?.url || defaultImg?.product}
                                        alt="product"
                                        placeholder='blur'
                                        blurDataURL={defaultImg?.placeholderImg}
                                        width={500}
                                        height={500}
                                        className="size-11 rounded-lg border-2 border-card object-cover shadow"
                                    />
                                ))}
                                {data?.data?.items?.length > 4 && (
                                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-card bg-surface text-xs font-bold text-foreground">
                                        +{data?.data?.items?.length - 4}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-muted-foreground">
                                <Package className="size-5" />
                            </span>
                        )}

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                                {data?.data?.items?.length} {data?.data?.items?.length === 1 ? "item" : "items"} in bundle
                                <span className="hidden text-muted-foreground sm:inline"> · {data?.data?.bundleDiscountPercent}% off</span>
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {data?.data?.items?.length > 0 ? (
                                    <>
                                        <span className="font-semibold text-foreground text-base"><FormatCurrency withGbp amount={data?.data?.total} /></span>{" "}
                                        {data?.data?.bundleDiscountAmount > 0 && <span className="line-through text-sm"><FormatCurrency amount={data?.data?.subTotal} /></span>}
                                    </>
                                ) : (
                                    "Pick items below to start your bundle"
                                )}
                            </p>
                        </div>
                    </div>
                }

                <Button
                    disabled={data?.data?.items?.length < 1}
                    className="rounded-full cursor-pointer"
                    onClick={() => setOpenReviewBundleModal(true)}
                >
                    Review bundle
                    {/* <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /> */}
                </Button>
            </div>

            <ReviewBundleModal
                open={openReviewBundleModal}
                setOpen={setOpenReviewBundleModal}
                data={data?.data}
            />

        </div>
    )
}

export default BundleFooter
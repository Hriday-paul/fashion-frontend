"use client";

import { IOfferItem } from '@/types'
import { defaultImg } from '@/utils/defaultImg'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useCurrency } from '@/hooks/useCurrency'

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

function OfferView({
    offerItems,
    open,
    setOpen,
    title = "Offer Items"
}: {
    offerItems: IOfferItem[], open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title?: string;
}) {
    const { format } = useCurrency();

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="w-[700px] rounded-none overflow-y-auto max-h-screen">

                <DialogHeader className="border-b border-gray-200 pb-3.5">
                    <h2 className="text-base font-medium text-center">{title}</h2>
                </DialogHeader>

                {offerItems?.map((item) => (
                    <Link href={`/shop/${item?.product?.id}`} key={item?.id} >
                        <div className="flex flex-row justify-between items-center gap-x-4 border-b py-3 group">
                            <div className="flex md:flex-row flex-col gap-x-4">
                                <div className="relative">
                                    <Image
                                        src={item?.product?.images[0]?.url || defaultImg?.product}
                                        alt="hero image"
                                        width={500}
                                        height={500}
                                        placeholder="blur"
                                        blurDataURL={defaultImg?.placeholderImg}
                                        className="h-16 w-16 rounded object-cover"
                                    />

                                </div>

                                <div className="text-base">
                                    <p className="text-base line-clamp-1">
                                        {item?.product?.title}
                                    </p>
                                    <p className="text-gray-700">{item?.product?.size?.title}</p>
                                    <p className="text-gray-700">Price: <span className="font-semibold text-primary-black">{format(item?.product?.finalPrice)}</span></p>
                                </div>
                            </div>

                            <ChevronRight className='group-hover:translate-x-1 transition-transform duration-200 text-gray-700 size-5' />
                        </div>
                    </Link>
                ))}

            </DialogContent>
        </Dialog>
    )
}

export default OfferView
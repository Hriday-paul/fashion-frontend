"use client";

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CartIcon } from '@/icons'
import { IProduct } from '@/types'
import { defaultImg } from '@/utils/defaultImg'
import { BadgePercent, Heart, Pencil } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import DeleteProduct from './DeleteProduct'
import MarkSold from './MarkSold'
import DropPrice from './DropPrice'
import { useCurrency } from '@/hooks/useCurrency'

export type IProductExtra = Omit<IProduct, "_count"> & {
    _count: {
        cartItems: number;
        favourites: number;
        offerItems: number;
    }
};

function SellProdCard({ data }: { data: IProductExtra }) {
    const { format } = useCurrency();
    const [isDeleted, setIsDeleted] = useState(false);
    const [isSold, setIsSold] = useState(false);
    const stock = isSold ? 0 : data?.stock;

    if (isDeleted) return null;

    return (
        <div className='space-y-3 border border-gray-200 p-2'>

            <div className="flex flex-row gap-x-2 items-start w-full">
                <Link href={`/shop/${data?.id}`} className="group relative">
                    <Image
                        src={data?.images?.[0]?.url || defaultImg?.product}
                        alt="product_image"
                        width={1200}
                        height={1200}
                        placeholder="blur"
                        blurDataURL={defaultImg?.placeholderImg}
                        className="h-28 w-40 object-cover origin-center cursor-pointer"
                    ></Image>
                    {stock < 1 && <div className="h-full w-full flex justify-center items-center absolute bottom-0 left-0">
                        <span className=" text-white text-[10px] py-0.5 w-full flex items-center justify-center bg-destructive">
                            SOLD OUT
                        </span>
                    </div>}
                </Link>

                <div className='space-y-1 w-full'>
                    <div className='flex flex-row justify-between items-center gap-x-0.5'>
                        <p className='text-xs text-gray-600'>{moment(data?.createdAt).fromNow()}</p>
                        <p className='text-base font-semibold line-clamp-1'>{format(data?.finalPrice)}</p>
                    </div>
                    <p className='text-base font-semibold line-clamp-1'>{data?.title}</p>
                    <p className='text-sm text-gray-500 line-clamp-1'>{data?.size?.title}</p>

                    <div className='flex flex-row gap-x-1 items-center mt-2'>

                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex flex-row gap-x-0.5 items-center bg-zinc-200 px-1.5 py-0.5 rounded-full">
                                    <BadgePercent className="size-3" />
                                    <p className="text-xs text-gray-800">
                                        {data?._count?.offerItems}
                                    </p>
                                </div>
                            </TooltipTrigger>

                            <TooltipContent className="rounded-none" side="top">
                                <p className="text-xs">{data?._count?.offerItems} offers sent</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex flex-row gap-x-0.5 items-center bg-zinc-200 px-1.5 py-0.5 rounded-full">
                                    <CartIcon className="!size-3" />
                                    <p className="text-xs text-gray-800">
                                        {data?._count?.cartItems}
                                    </p>
                                </div>
                            </TooltipTrigger>

                            <TooltipContent className="rounded-none" side="top">
                                <p className="text-xs">In cart {data?._count?.cartItems}</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex flex-row gap-x-0.5 items-center bg-zinc-200 px-1.5 py-0.5 rounded-full">
                                    <Heart className="!size-3" />
                                    <p className="text-xs text-gray-800">
                                        {data?._count?.favourites}
                                    </p>
                                </div>
                            </TooltipTrigger>

                            <TooltipContent className="rounded-none" side="top">
                                <p className="text-xs">{data?._count?.favourites} favourites</p>
                            </TooltipContent>
                        </Tooltip>

                    </div>

                </div>
            </div>

            <div className="space-y-2 [&_button]:w-full">
                {stock > 0 && (
                    <Link href={`/sell/${data?.id}`} className="block">
                        <Button size={"sm"} className="h-10 gap-1.5 rounded-none cursor-pointer text-sm font-medium"><Pencil className="size-4" />Edit Listing</Button>
                    </Link>
                )}
                <div className={`grid gap-2 ${stock > 0 ? "grid-cols-3" : "grid-cols-1"}`}>
                    {stock > 0 && (
                        <>
                            <DropPrice product={data} />
                            <MarkSold productId={data?.id} title={data?.title} onMarked={() => setIsSold(true)} />
                        </>
                    )}
                    <DeleteProduct productId={data?.id} title={data?.title} onDeleted={() => setIsDeleted(true)} />
                </div>
            </div>


        </div>
    )
}

export default SellProdCard
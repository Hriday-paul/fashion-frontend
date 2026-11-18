import ProductPrice from "@/components/shared/ProductPrice";
import React from 'react'
import { formatSize } from "@/lib/formatSize";
import FavouritesWithServer from "@/app/(public)/shop/[productId]/_components/FavouritesWithServer";
import { Card, CardContent } from "@/components/ui/card";
import { defaultImg } from "@/utils/defaultImg";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from '@/types';

type IFavoriteItem = { id: string, product: IProduct }

function FavouriteProdCard({ favoriteItem }: { favoriteItem: IFavoriteItem }) {
    const data = favoriteItem?.product;
    return (
        <Card className="border-none shadow-none p-0">
            <CardContent className="p-0">
                {/* ===================================== product image =============================== */}
                <div className="relative">

                    <div className="relative">
                        <Image
                            src={data?.images?.[0]?.url || defaultImg?.product}
                            alt="product_image"
                            width={1200}
                            height={1200}
                            placeholder="blur"
                            blurDataURL={defaultImg?.placeholderImg}
                            className="h-52 md:h-60 lg:h-64 object-cover origin-center rounded cursor-pointer"
                        ></Image>
                        <div className='absolute top-2 right-2'>
                            {/* ===================== favorite button ================ */}
                            <FavouritesWithServer id={data?.id} count={0} includedProduct={[{ id: '' }]}></FavouritesWithServer>
                        </div>
                    </div>

                    <Link href={`/shop/${data?.id}`} className="group">

                        {/* ===================== product title ================ */}
                        <p className="text-primary-gray text-sm group-hover:underline underline-offset-1 duration-150 mt-1">
                            {data?.title}
                        </p>
                        <div className='flex flex-row justify-between items-center'>
                            <p className="md:text-lg text-primary-black">{data?.brand?.name}</p>
                            <p className="md:text-lg text-primary-black">{formatSize(data?.size, data?.SizeFormat)}</p>
                        </div>
                        <ProductPrice price={data?.price} finalPrice={data?.finalPrice} />
                    </Link>

                </div>

            </CardContent>
        </Card>
    )
}

export default FavouriteProdCard
"use client";;
import ProductPrice from "@/components/shared/ProductPrice";
import FavouritesWithServer from "@/app/(public)/shop/[productId]/_components/FavouritesWithServer";
import { Card, CardContent } from "@/components/ui/card";
import { IProduct } from "@/types";
import { defaultImg } from "@/utils/defaultImg";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const PProductCard = ({
    data,
    ownProduct,
    children,
}: {
    data: IProduct;
    ownProduct?: boolean;
    children?: ReactNode;
}) => {
    return (
        <Card className="border-none shadow-none p-0">
            <CardContent className="md:space-y-4 space-y-2 p-0">
                {/* ===================================== product image =============================== */}
                <div className="relative">
                    <Link href={`/shop/${data?.id}`} className="group">
                        <Image
                            src={data?.images?.[0]?.url || defaultImg?.product}
                            alt="product_image"
                            width={1200}
                            height={1200}
                            placeholder="blur"
                            blurDataURL={defaultImg?.placeholderImg}
                            className="h-52 md:h-60 lg:h-64 object-cover origin-center rounded cursor-pointer"
                        ></Image>
                    </Link>

                    {/* ===================== favorite button ================ */}
                    {!ownProduct && <div className="absolute top-2 right-2">
                        <FavouritesWithServer id={data?.id} count={data?._count?.favourites} includedProduct={data?.favourites}></FavouritesWithServer>
                    </div>}

                    {data?.assistentSellId && <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="absolute top-2 left-2 bg-primary-black rounded-xs px-1 py-1 text-xs font-medium text-white flex flex-row gap-x-1 items-center">
                                <BadgeCheck className="size-5" />
                            </div>
                        </TooltipTrigger>

                        <TooltipContent className="rounded-none" side="top">
                            Authenticated Product
                        </TooltipContent>
                    </Tooltip>}

                </div>

                {/* ===================================== product details =============================== */}
                <div className="md:space-y-2 space-y-1">

                    {/* ===================== product title ================ */}
                    <Link href={`/shop/${data?.id}`} className="group">

                        {/* ===================== product title ================ */}
                        <p className="text-primary-gray text-sm group-hover:underline underline-offset-1 duration-150 mt-1 line-clamp-1">
                            {data?.title}
                        </p>
                        <div className='flex flex-row flex-wrap justify-between items-center'>
                            <p className="md:text-base text-primary-black">{data?.brand?.name}</p>
                            <p className="md:text-base text-primary-black">{data?.size?.title}</p>
                        </div>
                        <ProductPrice price={data?.price} finalPrice={data?.finalPrice} />
                    </Link>
                </div>

                {children}

            </CardContent>
        </Card>
    );
};

export default PProductCard;

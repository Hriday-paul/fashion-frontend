"use client";
import ProductPrice from "@/components/shared/ProductPrice";
import FavouritesWithServer from "@/app/(public)/shop/[productId]/_components/FavouritesWithServer";
import { Card, CardContent } from "@/components/ui/card";
import { IProduct } from "@/types";
import { defaultImg } from "@/utils/defaultImg";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { Heart } from "lucide-react";

const DonationProductCard = ({
  data,
  ownProduct = false,
  children,
}: {
  data: IProduct;
  ownProduct?: boolean;
  children?: ReactNode;
}) => {
  const { format } = useCurrency();

  return (
    <Card className="border-none shadow-none p-0">
      <CardContent className="md:space-y-3 space-y-2 p-0">
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
              className="h-52 object-cover origin-center rounded cursor-pointer"
            ></Image>

          </Link>

          {/* ===================== favorite button ================ */}
          {!ownProduct && <div className="absolute top-2 right-2">
            <FavouritesWithServer id={data?.id} count={data?._count?.favourites} includedProduct={data?.favourites}></FavouritesWithServer>
          </div>}

          <div className="absolute bottom-2 left-2 bg-green-600/80">
            <p className="text-xs text-white font-semibold px-2 py-1 rounded flex flex-row gap-x-1 items-center">
              <Heart size={12} />
              {data?.donation_percent}% donates from sales</p>
          </div>
        </div>

        {/* ===================================== product details =============================== */}
        < div className="md:space-y-2 space-y-1" >

          {/* ===================== product title ================ */}
          < Link href={`/shop/${data?.id}`} className="group" >

            {/* ===================== product title ================ */}
            <p className="text-primary-gray text-sm group-hover:underline underline-offset-1 duration-150 mt-1 line-clamp-1" >
              {data?.title}
            </p >
            <ProductPrice price={data?.price} finalPrice={data?.finalPrice} />
          </Link >
        </div >

        {children}

      </CardContent >
    </Card >
  );
};

export default DonationProductCard;

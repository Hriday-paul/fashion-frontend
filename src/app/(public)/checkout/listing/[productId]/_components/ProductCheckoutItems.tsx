import FormatCurrency from "@/components/shared/FormatCurrency";
import { IProductWithUser } from '@/app/(public)/shop/[productId]/_components/ProductDetails/ProductDetails';
import { formatSize } from "@/lib/formatSize";
import CustomAvatar from '@/components/ui/custom-avatar';
import { getCheckoutItems, GetOfferItems } from '@/lib/services/Cartprods';
import GetProductDetails from '@/lib/services/ProductDetails';
import { ICartGroup, IOffer } from '@/types';
import { defaultImg } from '@/utils/defaultImg';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

async function ProductCheckoutItems({ productId }: { productId: string }) {
  const detailPromise = GetProductDetails({ id: productId });


  return (
    <div>
      <Suspense fallback={<div className="flex-center h-40 bg-white">
        <span className="loaderDark !w-12"> </span>
      </div>}>
        <CartProds cartPromise={detailPromise} />
      </Suspense>
    </div>
  )
}

export default ProductCheckoutItems;

const CartProds = async ({ cartPromise }: { cartPromise: Promise<{ data: IProductWithUser }> }) => {
  const cartProds = await cartPromise;

  const cartGroup = cartProds?.data;

  const item = {
    product: cartGroup,
  }

  if (!cartGroup) {
    return notFound();
  }

  return <>
    {
      <div className="space-y-5 shadow">

        <div className="flex flex-col lg:flex-row items-center bg-white p-5 shadow justify-start gap-3">

          <div className="w-full">
            <div className="flex flex-row items-center gap-x-3 mb-2 w-full">

              <Link
                href={`/member/${cartGroup?.user?.userName}`}
                className="cursor-pointer"
              >
                <CustomAvatar image={cartGroup?.user?.picture?.url || null} name={cartGroup?.user?.userName} className="!size-10"></CustomAvatar>
              </Link>

              <div>
                <Link
                  href={`/member/${cartGroup?.user?.userName}`}
                  className="flex items-center cursor-pointer"
                >
                  <p className="font-semibold text-lg leading-4">{cartGroup?.user?.userName}</p>
                </Link>
              </div>

            </div>


            <div className="flex flex-row gap-x-2 items-start">
              <Link
                href={`/shop/${item?.product?.id}`}
                className="cursor-pointer shrink-0"
              >
                <div className='relative'>
                  <Image src={item?.product?.images?.[0]?.url || defaultImg?.product} alt={item?.product?.title} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} width={1000} height={1000} className="size-28 object-cover" />

                  {(item?.product?.stock <= 0 || item?.product?.isDeleted) && <div className='absolute top-0 left-0 h-full w-full bg-transparent flex justify-center items-center'>
                    <span className='py-1 text-xs bg-primary-black/60 text-white text-center w-full flex-1'>{item?.product?.isDeleted ? 'Not Available' : 'SOLD OUT'}</span>
                  </div>}
                </div>
              </Link>
              <div>
                <Link
                  href={`/shop/${item?.product?.id}`}
                  className="space-y-1"
                >
                  <p className="text-base line-clamp-1 text-gray-700">{item?.product?.title}</p>
                  <div className='flex flex-row items-center gap-x-2'>
                    <p className="text-lg font-bold"><FormatCurrency fixed estimate amount={item?.product?.finalPrice} decimals={2} /></p>
                  </div>
                  <p className="text-sm text-gray-700">{formatSize(item?.product?.size, item?.product?.SizeFormat)}</p>
                </Link>

              </div>
            </div>


          </div>



        </div>
      </div>
    }

  </>

}

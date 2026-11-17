import CustomAvatar from '@/components/ui/custom-avatar';
import { formatSize } from "@/lib/formatSize";
import { getCheckoutItems } from '@/lib/services/Cartprods';
import { ICartGroup } from '@/types';
import { defaultImg } from '@/utils/defaultImg';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

async function CheckoutItems({ cartGroupId }: { cartGroupId: string }) {

    const cartPromise = getCheckoutItems(cartGroupId);

    return (
        <>
            <Suspense fallback={<div className="flex-center h-40 bg-white">
                <span className="loaderDark !w-12"> </span>
            </div>}>
                <CartProds cartPromise={cartPromise} />
            </Suspense>
        </>
    )
}

const CartProds = async ({ cartPromise }: { cartPromise: Promise<{ data: ICartGroup }> }) => {
    const cartProds = await cartPromise;

    const cartGroup = cartProds?.data;

    const haveItem = cartGroup?.items && cartGroup?.items.length > 0;

    if (!haveItem) {
        return notFound();
    }

    return <>
        {
            <div className="space-y-5 shadow">

                <div className="flex flex-col lg:flex-row items-center bg-white p-5 shadow justify-start gap-3">

                    <div className="w-full">
                        <div className="flex flex-row items-center gap-x-3 mb-2 w-full">

                            <Link
                                href={`/member/${cartGroup?.seller?.userName}`}
                                className="cursor-pointer shrink-0"
                            >
                                <CustomAvatar image={cartGroup?.seller?.picture?.url || null} name={cartGroup?.seller?.userName} className="!size-10"></CustomAvatar>
                            </Link>

                            <div>
                                <Link
                                    href={`/member/${cartGroup?.seller?.userName}`}
                                    className="flex items-center cursor-pointer"
                                >
                                    <p className="font-semibold text-lg leading-4">{cartGroup?.seller?.userName}</p>
                                </Link>
                            </div>

                        </div>

                        <div className="space-y-2">
                            {
                                cartGroup?.items?.map((item) => (
                                    <div key={item?.id}>

                                        <div className="flex flex-row gap-x-2 items-start">
                                            <Link
                                                href={`/shop/${item?.product?.id}`}
                                                className="cursor-pointer shrink-0"
                                            ><Image src={item?.product?.images?.[0]?.url || defaultImg?.product} alt={item?.product?.title} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} width={1000} height={1000} className="size-28 object-cover" />
                                            </Link>
                                            <div>
                                                <Link
                                                    href={`/shop/${item?.product?.id}`}
                                                    className="space-y-1"
                                                >
                                                    <p className="text-base line-clamp-1 text-gray-700">{item?.product?.title}</p>
                                                    <div className='flex flex-row items-center gap-x-2'>
                                                        <p className="text-lg font-bold">${item?.product?.finalPrice?.toFixed(2)}</p>
                                                        {item?.extraDonation > 0 && (
                                                            <p className="text-sm font-bold">+ {item?.extraDonation?.toFixed(2)} (extra donation)</p>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-700">{formatSize(item?.product?.size, item?.product?.SizeFormat)}</p>
                                                </Link>

                                            </div>
                                        </div>

                                    </div>

                                ))
                            }

                        </div>
                    </div>



                </div>
            </div>
        }

    </>

}

export default CheckoutItems
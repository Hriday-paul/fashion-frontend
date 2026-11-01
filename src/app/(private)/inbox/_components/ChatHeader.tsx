"use client"
import { ReportDialog } from '@/components/shared/Message/ReportDialog'
import Image from 'next/image'
import React, { useState, useTransition } from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import moment from 'moment';
import Link from 'next/link';
import CustomAvatar from '@/components/shared/CustomAvatar';
import { useGetChatDetailsQuery } from '@/redux/api/message.api';
import { IProduct, IUser } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, X } from 'lucide-react';
import SendOfferModal from '@/components/shared/Modal/SendOfferModal';
import { BuyFromChat } from '@/lib/Actions/Product.api';
import { toast } from 'sonner';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import OfferView from '@/components/shared/Message/OfferView';
import { useCurrency } from '@/hooks/useCurrency';

function formatLastActive(date: Date | string) {
    const activeDate = moment(date);
    const now = moment();

    let dateText: string;

    if (activeDate.isSame(now, "day")) {
        dateText = "today";
    } else if (activeDate.isSame(now.clone().subtract(1, "day"), "day")) {
        dateText = "yesterday";
    } else if (activeDate.isSame(now, "week")) {
        dateText = activeDate.format("dddd");
    } else {
        dateText = activeDate.format("D MMMM");
    }

    return `last active ${dateText} at ${activeDate.format("h:mm A")}`;
}

function ChatHeader({ chatId }: { chatId: string }) {

    const { data: userData, isLoading, isSuccess } = useGetChatDetailsQuery({ chatId });

    if (isLoading) {
        return <Skeleton className="w-full h-16 rounded-none" />
    }

    return (
        isSuccess ? <div>

            <div className="border-b border-gray-200 flex items-center justify-center px-4 py-2.5">
                <div className="flex items-center gap-x-3 w-full justify-center">

                    <Link href={`/member/${userData?.data?.user?.userName}`}>
                        <div className="lg:flex-grow">
                            <h3 className="text-base font-semibold">{userData?.data?.user?.userName || 'Unknown'}</h3>
                        </div>
                    </Link>
                </div>
                <div>
                    <ReportDialog />
                </div>
            </div>

            {isSuccess && <ChatHeaderDetails data={userData?.data} chatId={chatId} />}

        </div> : <></>
    )
}

export default ChatHeader;

interface ChatHeaderDetailsProps {

    id: string,
    user: IUser,
    items: {
        id: string,
        product: IProduct
    }[],
    itemsPrice: number,
    isUnavailable: boolean

}

const ChatHeaderDetails = ({ data, chatId }: { data: ChatHeaderDetailsProps, chatId: string }) => {
    const isSingleItem = data?.items?.length === 1;
    const router = useRouter();

    const [openItemDetails, setOpenItemDetails] = React.useState(false);

    const handleClick = () => {
        if (isSingleItem) {
            router.push(`/shop/${data?.items[0]?.product?.id}`);
        } else {
            setOpenItemDetails(true);
        }
    }

    return <div className='relative'>
        <div className='flex flex-row justify-between items-center p-2 border-b border-gray-200 bg-zinc-50'>

            <div onClick={handleClick} className='cursor-pointer'>
                {isSingleItem ? <SingleItemHeader data={data} /> : <MultipleItemsHeader data={data} />}
            </div>

            {!data?.isUnavailable && <ActionButtons items={data?.items} sellerId={data?.user?.id} chatId={data?.id || chatId} />}
        </div>

        {/* {openItemDetails && <div className='w-full bg-white absolute top-0 left-0 z-10 shadow'>
            <div className='flex flex-row justify-between items-center p-2 border-b border-gray-100'>
                <p className='font-semibold'>Details</p>
                <Button className='cursor-pointer' onClick={() => setOpenItemDetails(false)} variant="ghost"><X size={24} /></Button>
            </div>

            <div className='space-y-3'>
                {data?.items?.map((item) => (
                    <Link key={item?.id} href={`/shop/${item?.product?.id}`}>
                        <div className='flex flex-row gap-x-2 items-center  border-b border-gray-100 px-2 py-2.5 justify-between hover:bg-gray-50 duration-150'>
                            <div className='flex flex-row gap-x-2 items-start'>
                                <Image src={item?.product?.images?.[0]?.url || ''} alt={item?.product?.title || 'Product Image'} className='w-12 h-12 object-cover rounded' width={500} height={500} />
                                <div>
                                    <p className='text-base font-semibold'>{item?.product?.title}</p>
                                    <p className='text-sm text-gray-600'>${item?.product?.finalPrice}</p>
                                </div>
                            </div>
                            <ChevronRight className='text-gray-500 size-5' />
                        </div>
                    </Link>
                ))}
            </div>

            <Link href={`/member/${data?.user?.userName}/bundle`} className='w-full'>
                <div className='flex flex-row gap-x-2 items-center justify-between p-2.5 hover:bg-gray-50 duration-150'>
                    <div className='flex flex-row gap-x-2 items-center'>
                        <span className='border border-black p-2'>
                            <Plus size={25} />
                        </span>
                        <div>
                            <p className='text-base font-semibold'>Add more items</p>
                            <p className='text-gray-600 text-sm'>Get discounts on your purchase</p>
                        </div>
                    </div>
                    <ChevronRight className='text-gray-500 size-5' />
                </div>
            </Link>

            <div className="flex items-center gap-x-3 p-2.5 border-b border-gray-100">

                <Link href={`/member/${data?.user?.userName}`}>
                    <CustomAvatar img={data?.user?.picture?.url} name={data?.user?.userName || 'Unknown'} className="md:size-12 size-10" fallbackClass="text-base md:text-base" />
                </Link>

                <Link href={`/member/${data?.user?.userName}`}>
                    <div className="lg:flex-grow">
                        <p className="text-base font-semibold">{data?.user?.userName || 'Unknown'}</p>
                    </div>
                </Link>
            </div>

            <div className='p-2.5'>
                <ReportDialog />
            </div>

        </div>} */}

        {data?.isUnavailable && <div className='bg-red-700 text-white p-1.5 text-center text-sm font-semibold'>
            Some items in this chat are no longer available.
        </div>}

        <OfferView offerItems={data?.items as any} open={openItemDetails} setOpen={setOpenItemDetails} title={"Chat Items"} />

    </div>
}

const SingleItemHeader = ({ data }: { data: ChatHeaderDetailsProps }) => {
    const { format } = useCurrency();
    const product = data?.items[0]?.product;
    return <div>
        <div className='flex flex-row gap-x-2 items-start'>
            <Image src={product?.images?.[0]?.url || ''} alt={product?.title || 'Product Image'} className='w-12 h-12 object-cover rounded' width={500} height={500} />
            <div>
                <h3 className='text-base font-semibold'>{product?.title}</h3>
                <p className='text-sm text-gray-600'>{format(product?.finalPrice)} <span>+ service fee</span></p>
            </div>
        </div>

    </div>
}

const MultipleItemsHeader = ({ data }: { data: ChatHeaderDetailsProps }) => {
    const { format } = useCurrency();
    const itemsCount = data?.items?.length;

    const firstProduct = data?.items[0]?.product;

    return <div>

        <div className='flex flex-row gap-x-2 items-start'>
            <div className='relative'>
                <Image src={firstProduct?.images?.[0]?.url || ''} alt={firstProduct?.title || 'Product Image'} className='w-12 h-12 object-cover rounded' width={500} height={500} />

                <span className='absolute top-0 right-0 bg-black/50 text-white w-full h-full flex justify-center items-center font-semibold rounded'>{`+${itemsCount - 1}`}</span>
            </div>
            <div>
                <p className='text-base font-semibold'>{itemsCount} items</p>
                <p className='text-sm font-medium text-gray-600'>{format(data?.itemsPrice)} + service fee</p>
            </div>
        </div>

    </div>
}

const ActionButtons = ({ items, sellerId, chatId }: { items: ChatHeaderDetailsProps['items'], sellerId: string, chatId: string }) => {

    const [openOfferModal, setOpenOfferModal] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const products = items?.map((item) => item?.product);

    const handlemakeOffer = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setOpenOfferModal(true);
    }

    const handleBuyNow = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (!items || items.length === 0) return;

        if (items.length === 1) {
            const productId = items[0]?.product?.id;
            if (!productId) return;
            startTransition(() => {
                router.push(`/checkout/listing/${productId}`);
            });
            return;
        }

        setLoading(true);
        try {
            const res = await BuyFromChat({
                payload: {
                    chatId,
                    sellerId,
                },
            });

            if (!res.success || !res?.data?.id) {
                throw new Error(res.message || "Failed to initiate checkout");
            }

            startTransition(() => {
                router.push(`/checkout/offer/${res.data!.id}`);
            });
        } catch (error: any) {
            if (isRedirectError(error)) {
                throw error;
            }
            toast.error(error?.message || "Failed to initiate checkout");
        } finally {
            setLoading(false);
        }
    }

    const isBuying = loading || isPending;

    return <div className='flex flex-row gap-x-2'>
        <Button variant="outline" className='cursor-pointer border-primary-black shadow-none rounded-md' onClick={handlemakeOffer}>Make an offer</Button>

        <Button className='cursor-pointer min-w-[92px] rounded-md' disabled={isBuying} onClick={handleBuyNow}>
            {isBuying ? <div className="w-5 aspect-square rounded-full border-[2px] border-white border-r-gray-500 animate-spin"></div> : "Buy Now"}
        </Button>

        <SendOfferModal open={openOfferModal} setOpen={setOpenOfferModal} products={products} sellerId={sellerId} />

    </div>
}

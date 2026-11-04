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
import { redirect, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ChevronRight, Plus, X } from 'lucide-react';
import SendOfferModal from '@/components/shared/Modal/SendOfferModal';
import { BuyFromChat } from '@/lib/Actions/Product.api';
import { toast } from 'sonner';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import OfferView from '@/components/shared/Message/OfferView';
import { useCurrency } from '@/hooks/useCurrency';
import { defaultImg } from '@/utils/defaultImg';

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
        isSuccess ? <div className="w-full">

            <div className="border-b border-gray-200 flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5">
                <Link
                    href="/inbox"
                    className="lg:hidden p-1 -ml-1 text-gray-700 hover:text-black transition-colors shrink-0"
                    aria-label="Back to messages"
                >
                    <ArrowLeft className="size-5" />
                </Link>

                <div className="flex items-center gap-x-2 min-w-0 flex-1 justify-center">
                    <Link href={`/member/${userData?.data?.user?.userName}`} className="min-w-0 max-w-full">
                        <h3 className="text-sm sm:text-base font-semibold truncate">
                            {userData?.data?.user?.userName || 'Unknown'}
                        </h3>
                    </Link>
                </div>

                <div className="shrink-0">
                    <ReportDialog />
                </div>
            </div>

            {(isSuccess && userData?.data) && <ChatHeaderDetails data={userData?.data} chatId={chatId} />}

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
    isUnavailable: boolean,
    isImSeller: boolean,

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

    return <div className='relative w-full'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5 p-2.5 sm:p-3 border-b border-gray-200 bg-zinc-50'>

            <div onClick={handleClick} className='cursor-pointer min-w-0 flex-1'>
                {isSingleItem ? <SingleItemHeader data={data} /> : <MultipleItemsHeader data={data} />}
            </div>

            {!data?.isUnavailable && (
                <ActionButtons
                    items={data?.items}
                    sellerId={data?.user?.id}
                    chatId={data?.id || chatId}
                    isImSeller={data?.isImSeller}
                />
            )}
        </div>

        {data?.isUnavailable && (
            <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-3.5 py-2 text-amber-800">
                <AlertCircle className="size-4 shrink-0 text-amber-600" />
                <p className="text-xs sm:text-sm font-medium">
                    Some items in this chat are no longer available.
                </p>
            </div>
        )}

        <OfferView offerItems={(data?.items || []) as any} open={openItemDetails} setOpen={setOpenItemDetails} title={"Chat Items"} />

    </div>
}

const SingleItemHeader = ({ data }: { data: ChatHeaderDetailsProps }) => {
    const { format } = useCurrency();
    const product = data?.items[0]?.product;
    return <div className='min-w-0'>
        <div className='flex flex-row gap-x-2.5 items-center min-w-0'>
            <Image
                src={product?.images?.[0]?.url || defaultImg?.product}
                alt={product?.title || 'Product Image'}
                className='w-11 h-11 sm:w-12 sm:h-12 object-cover rounded shrink-0'
                width={500}
                height={500}
            />
            <div className='min-w-0 flex-1'>
                <h3 className='text-sm sm:text-base font-semibold line-clamp-1 break-all'>{product?.title}</h3>
                <p className='text-xs sm:text-sm text-gray-600 truncate'>
                    {format(product?.finalPrice)} <span>+ service fee</span>
                </p>
            </div>
        </div>
    </div>
}

const MultipleItemsHeader = ({ data }: { data: ChatHeaderDetailsProps }) => {
    const { format } = useCurrency();
    const itemsCount = data?.items?.length;

    const firstProduct = data?.items[0]?.product;

    return <div className='min-w-0'>
        <div className='flex flex-row gap-x-2.5 items-center min-w-0'>
            <div className='relative shrink-0'>
                <Image
                    src={firstProduct?.images?.[0]?.url || defaultImg?.product}
                    alt={firstProduct?.title || 'Product Image'}
                    className='w-11 h-11 sm:w-12 sm:h-12 object-cover rounded'
                    width={500}
                    height={500}
                />

                <span className='absolute inset-0 bg-black/50 text-white flex justify-center items-center text-xs sm:text-sm font-semibold rounded'>
                    {`+${itemsCount - 1}`}
                </span>
            </div>
            <div className='min-w-0 flex-1'>
                <p className='text-sm sm:text-base font-semibold truncate'>{itemsCount} items</p>
                <p className='text-xs sm:text-sm font-medium text-gray-600 truncate'>
                    {format(data?.itemsPrice)} + service fee
                </p>
            </div>
        </div>
    </div>
}

const ActionButtons = ({ items, sellerId, chatId, isImSeller }: { items: ChatHeaderDetailsProps['items'], sellerId: string, chatId: string, isImSeller: boolean }) => {

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

    return <div className='flex flex-row items-center gap-2 w-full sm:w-auto shrink-0'>
        <Button
            variant="outline"
            className='cursor-pointer border-primary-black shadow-none rounded-md flex-1 sm:flex-initial text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4'
            onClick={handlemakeOffer}
        >
            {isImSeller ? "Send" : "Make"} an offer
        </Button>

        {!isImSeller && (
            <Button
                className='cursor-pointer min-w-[92px] rounded-md flex-1 sm:flex-initial text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4'
                disabled={isBuying}
                onClick={handleBuyNow}
            >
                {isBuying ? (
                    <div className="w-5 aspect-square rounded-full border-[2px] border-white border-r-gray-500 animate-spin"></div>
                ) : (
                    "Buy Now"
                )}
            </Button>
        )}

        <SendOfferModal open={openOfferModal} setOpen={setOpenOfferModal} products={products} sellerId={sellerId} />

    </div>
}

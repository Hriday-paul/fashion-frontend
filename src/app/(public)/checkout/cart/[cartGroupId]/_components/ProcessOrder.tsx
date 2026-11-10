"use client"
import { Button } from '@/components/ui/button'
import { makeListingOrder, makeOfferOrder, makeOrder } from '@/lib/Actions/Order.action';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';

function ProcessOrder({ cartGroupId, mode, haveAnyUnavailableItems }: { cartGroupId: string; mode: 'cart' | 'offer' | 'listing'; haveAnyUnavailableItems: boolean }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const router = useRouter();

    const shippingcart = useSelector((state: RootState) => state.cart.carts?.find((cart) => cart?.cartGroupId === cartGroupId));

    const handleProcessOrder = async () => {
        if (!shippingcart || !shippingcart?.shipment) {
            setError("Please select a shipping service before proceeding.");
            return;
        }
        setIsLoading(true);
        try {

            if (mode === 'listing') {
                const res = await makeListingOrder({
                    payload: {
                        productId: cartGroupId,
                        shipmentServiceId: shippingcart?.shipment?.serviceId,
                        allowedAuthentication: shippingcart?.allowedAuthentication,
                        treeGiftCount: shippingcart?.treeCount
                    }
                });

                if (!res.success) {
                    throw new Error(res.message);
                }

                router.replace(res?.data);
            } else if (mode === 'offer') {
                const res = await makeOfferOrder({
                    payload: {
                        cartGroupId,
                        offerId: cartGroupId,
                        shipmentServiceId: shippingcart?.shipment?.serviceId,
                        allowedAuthentication: shippingcart?.allowedAuthentication,
                        treeGiftCount: shippingcart?.treeCount
                    }
                });

                if (!res.success) {
                    throw new Error(res.message);
                }

                router.replace(res?.data);
            } else {
                const res = await makeOrder({
                    payload: {
                        cartGroupId,
                        offerId: cartGroupId,
                        shipmentServiceId: shippingcart?.shipment?.serviceId,
                        allowedAuthentication: shippingcart?.allowedAuthentication,
                        treeGiftCount: shippingcart?.treeCount
                    }
                });
                if (!res.success) {
                    throw new Error(res.message);
                }
                router.replace(res?.data);
            }

        } catch (err: any) {

            setError(err?.message || "Something went wrong, try again");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {error && (
                <div className="rounded px-3 py-2">
                    <p className="text-base text-red-600">{error}</p>
                </div>
            )}

            {
                haveAnyUnavailableItems && (
                    <div className="rounded px-3 py-2">
                        <p className="text-base text-red-600">Some items in your {mode} are sold out or unavailable.</p>
                    </div>
                )
            }

            <Button
                size="sm"
                onClick={handleProcessOrder}
                disabled={!shippingcart?.shipment?.serviceId || isLoading || haveAnyUnavailableItems}
                className="flex-1 py-6 cursor-pointer rounded-none w-full font-semibold text-lg bg-green-600 hover:bg-green-500 duration-200 transition-colors">

                {isLoading ? <span className="loader" /> : "Proceed to Payment"}

            </Button>
        </>

    )
}

export default ProcessOrder

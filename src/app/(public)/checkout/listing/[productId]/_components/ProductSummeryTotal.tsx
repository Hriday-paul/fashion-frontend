"use client";
import { OrderSummeryType } from '@/types'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    CardContent,
} from "@/components/ui/card";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

function ProductSummeryTotal({ summery, cartGroupId }: { summery: OrderSummeryType, cartGroupId: string }) {

    const shippingCart = useSelector((state: RootState) => state?.cart?.carts).find((cart) => cart?.cartGroupId === cartGroupId);

    const treeGiftCost = shippingCart?.treeCostTotal || 0;
    const authenticationCost = shippingCart?.allowedAuthentication ? 15 : 0;

    const shippingCost = shippingCart?.shipment?.shipment_charge_total || 0;

    const totalCost = summery?.subTotal + shippingCost + treeGiftCost + authenticationCost + summery?.serviceFeeCost;

    return (
        <CardContent>
            <hr />
            <div className="space-y-3 mt-4">
                <div className="flex justify-between ">
                    <p className="text-gray-700">Price:</p>
                    <p className="font-medium">${summery?.itemTotal.toFixed(2)}</p>
                </div>

                <div className="flex justify-between ">
                    <p className="text-gray-700 flex flex-row gap-x-1 items-center">Service Fee
                        <Tooltip>
                            <TooltipTrigger>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark text-black cursor-pointer"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                            </TooltipTrigger>

                            <TooltipContent className="rounded-none" side="top">
                                <p className="text-sm">Covers secure payment processing, buyer <br /> protection, customer support, and helps <br /> keep our marketplace safe and reliable.</p>
                            </TooltipContent>
                        </Tooltip> :
                    </p>
                    <p className="font-medium">${summery?.serviceFeeCost?.toFixed(2)}</p>
                </div>
                <div className="flex justify-between ">
                    <p className="text-gray-700">Verify & Authentication of Goods:</p>
                    <p className="font-medium">${authenticationCost?.toFixed(2)}</p>
                </div>
                <div className="flex justify-between ">
                    <p className="text-gray-700">Gift Trees:</p>
                    <p className="font-medium">${treeGiftCost?.toFixed(2)}</p>
                </div>

                {shippingCost > 0 && <div className="flex justify-between ">
                    <p className="text-gray-700 flex flex-row gap-x-1 items-center">Shipping
                        <Tooltip>
                            <TooltipTrigger>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark text-black cursor-pointer"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                            </TooltipTrigger>

                            <TooltipContent className="rounded-none" side="top">
                                <p className="text-sm">(Taxes and VAT included)</p>
                            </TooltipContent>
                        </Tooltip> :
                    </p>
                    <p className="font-medium">${shippingCost?.toFixed(2)}</p>
                </div>}

                <hr />
                <div className="flex justify-between ">
                    <p className="text-gray-800 font-semibold text-lg">Total:</p>

                    <p className="font-semibold text-lg">${totalCost?.toFixed(2)}</p>
                </div>
            </div>
        </CardContent>
    )
}

export default ProductSummeryTotal
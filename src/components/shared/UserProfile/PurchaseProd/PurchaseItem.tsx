"use client"
import FormatCurrency from "@/components/shared/FormatCurrency";
import { IOrder, OrderStatus } from '@/types'
import React, { useState } from 'react'
import moment from "moment"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { defaultImg } from "@/utils/defaultImg"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import {
    ChevronDown,
    MessageCircle,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getOrderStatusFormat } from "@/utils/EnumFormater"
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RequestCancelItem } from '@/lib/Actions/Order.action';
import { toast } from 'sonner';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import CancelReasonView from '../Sale-Product/CancelReasonView';
import CancelOrderForm from '../Sale-Product/CancelOrderForm';
import PurchaseAction from './PurchaseAction';

function PurchaseItem({ order }: { order: IOrder }) {

    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
    const [isCancelling, setIsCancelling] = useState(false)

    const billingDetails = order?.billingDetails;

    const locationParts = [
        billingDetails?.zip_code,
        billingDetails?.state,
        billingDetails?.city,
        billingDetails?.country,
    ].filter(Boolean);

    const locationLine = locationParts.join(", ");

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedItemIds)
        if (checked) {
            newSelected.add(id)
        } else {
            newSelected.delete(id)
        }
        setSelectedItemIds(newSelected)
    }

    const handleReqCancelSelectedItems = async (payload: { reason: string; reason_details?: string }, evidenceFiles: File[]) => {
        if (selectedItemIds.size === 0) return

        try {
            setIsCancelling(true)

            const itemIds = Array.from(selectedItemIds)

            const data = {
                cancelReason: payload.reason,
                cancelReasonDescription: payload.reason_details,
                orderId: order.id,
                itemIds,
            }

            const formData = new FormData()
            formData.append("data", JSON.stringify(data))

            evidenceFiles.forEach((file) => {
                formData.append("evidences", file);
            });

            const res = await RequestCancelItem({ payload: formData });

            if (!res.success) {
                throw new Error(res.message);
            }

            setSelectedItemIds(new Set())
        } catch (error: any) {
            if (isRedirectError(error)) {
                throw error;
            }
            toast.error(error?.message || "Failed to cancel selected items. Please try again.")
        } finally {
            setIsCancelling(false)
        }
    }

    const itemsBaseTotal = order?.items.reduce((total, item) => total + item.unitPrice, 0);

    const totalExtraDonation = order?.items.reduce((total, item) => total + item.extra_donation, 0);


    return (
        <div className="flex flex-col md:flex-row justify-between border border-gray-200 border-b-0 last:border-b rounded-none p-4" key={order?.id}>

            {/* Left: customer + items */}
            <div className="order-2 md:order-1 flex-1">

                <div className="">
                    <p className="text-gray-900 text-sm font-medium">{order?.orderNumber}</p>
                    <p className="text-primary-black text-base font-medium">USD <FormatCurrency fixed amount={order?.totalPrice} decimals={2} /></p>
                </div>

                {selectedItemIds.size > 0 && (
                    <div className="mt-2">

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="rounded-none cursor-pointer"
                                    disabled={isCancelling}
                                // onClick={handleCancelSelectedItems}
                                >
                                    <Trash2 className="size-4 mr-1" />
                                    {isCancelling
                                        ? <span className="loader" />
                                        : `Req. Cancel Item${selectedItemIds.size > 1 ? "s" : ""} (${selectedItemIds.size})`}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className='rounded-none'>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className=''>Cancel Items</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to cancel the selected items? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <CancelOrderForm isLoading={isCancelling} handleCancelOrder={(data, evidenceFiles) => handleReqCancelSelectedItems(data, evidenceFiles)} />

                            </AlertDialogContent>
                        </AlertDialog>

                    </div>
                )}

                <ul className="mt-4 space-y-3">
                    {order?.items.map((item) => (
                        <li key={item.id} className="flex gap-4">

                            {(!item?.isCancelled && item?.buyerRequestCancel == "NOT_REQUESTED") && <Checkbox
                                id={`row-${item.id}-checkbox`}
                                name={`row-${item.id}-checkbox`}
                                checked={selectedItemIds.has(item.id)}
                                className='cursor-pointer rounded-none border-gray-300'
                                onCheckedChange={(checked) =>
                                    handleSelectRow(item.id, checked === true)
                                }
                            />}

                            <Link href={`/shop/${item.product?.id}`}>
                                <Image
                                    src={item.product?.images?.[0]?.url || defaultImg?.product}
                                    alt={item.product?.title || "Product image"}
                                    loading="lazy"
                                    width={1000}
                                    height={1000}
                                    className="size-20 shrink-0 rounded border border-border object-cover"
                                />
                            </Link>
                            <div className="flex-1 space-y-0.5 flex flex-row items-start gap-x-3">

                                <div className="space-y-0.5">

                                    <p className={cn("text-base text-gray-800 font-medium", item?.isCancelled ? "line-through" : "")}>
                                        <Link href={`/shop/${item.product?.id}`}>
                                            {item?.product?.title}
                                        </Link>
                                    </p>
                                    <p className={cn("text-sm text-muted-foreground", item?.isCancelled ? "line-through" : "")}>
                                        Size <span className="font-semibold text-foreground">{item.product?.size?.title}</span>
                                    </p>
                                    <p className={cn("text-sm text-muted-foreground", item?.isCancelled ? "line-through" : "")}>
                                        Price <span className="font-semibold text-foreground"><FormatCurrency fixed amount={item.unitAllocatedPrice} /></span>
                                        {item?.unitAllocatedPrice !== item?.unitPrice && <span className="font-semibold text-xs text-gray-600 line-through ml-1"><FormatCurrency fixed amount={item.unitPrice} /></span>}
                                        {item?.extra_donation > 0 && <span className="font-semibold text-xs text-green-700 ml-1">+ <FormatCurrency fixed amount={item?.extra_donation} /> extra donated</span>}
                                    </p>

                                    {
                                        item?.isCancelled ? <CancelReasonView trigger={<Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant={"outline"} className={"font-semibold rounded-none bg-red-500/10 text-red-500 cursor-pointer"}>
                                                    Cancelled
                                                </Badge>
                                            </TooltipTrigger>

                                            <TooltipContent className="rounded-none" side="top">
                                                <p className="text-xs">Click for view reason</p>
                                            </TooltipContent>
                                        </Tooltip>} cancelReason={item?.cancelReason} cancelReasonDetails={item?.cancelReasonDetails} cancelEvidences={item?.cancelEvidences} />

                                            :

                                            item?.buyerRequestCancel == "REQUESTED" ? <CancelReasonView trigger={<Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Badge variant={"outline"} className={"rounded-none text-orange-500 border-orange-500 text-xs cursor-pointer"}>
                                                        Cancel Requested
                                                    </Badge>
                                                </TooltipTrigger>

                                                <TooltipContent className="rounded-none" side="top">
                                                    <p className="text-xs">Click for view reason</p>
                                                </TooltipContent>
                                            </Tooltip>} cancelReason={item?.cancelReason} cancelReasonDetails={item?.cancelReasonDetails} cancelEvidences={item?.cancelEvidences} />

                                                :

                                                item?.buyerRequestCancel == "REJECTED" ? <Badge variant={"outline"} className={"rounded-none text-yellow-600 border-yellow-500 text-xs"}>
                                                    Cancel Request Declined
                                                </Badge>

                                                    :

                                                    <></>
                                    }
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right: shipping details + order actions */}
            <div className="space-y-2 lg:space-y-3 min-w-80 order-1 md:order-2 pb-5 md:pb-0 max-w-xs">

                <div className="flex flex-row justify-between items-center">

                    <Tooltip>
                        <TooltipTrigger>
                            <Badge variant={["CANCELLED", "COMPLETED"].includes(order?.status) ? "destructive" : "outline"} className={cn(getOrderStatusFormat(order)?.color, "font-semibold rounded-none")}>
                                {getOrderStatusFormat(order)?.label}
                            </Badge>
                        </TooltipTrigger>

                        <TooltipContent className="rounded-none" side="top">
                            <p className="text-xs">{getOrderStatusFormat(order)?.details}</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="flex flex-row items-center gap-x-2">

                        <Link href={`/inbox/${order?.seller?.userName}`} className="cursor-pointer">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="cursor-pointer"
                            >
                                <MessageCircle className="size-5 text-muted-foreground" />
                            </Button>
                        </Link>

                        <PurchaseAction order={order} />
                    </div>
                </div>

                <p className="text-gray-700 text-sm">Ordered <span className="text-primary-black font-medium">{moment(order.createdAt).format("MM/DD/YYYY, h:mm a")}</span></p>

                <Collapsible>

                    <CollapsibleTrigger asChild>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm cursor-pointer"
                        // onClick={() => orderAction("Delivery details opened")}
                        >
                            Pricing details
                            <ChevronDown className="size-3.5" />
                        </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-2">
                        <div className="space-y-0.5 mt-1">
                            <div className="space-y-2 mt-4">

                                {
                                    order?.pricingSource == "BUNDLE" ? <div className="flex justify-between text-sm">
                                        <p className="text-gray-700">Items Total:</p>
                                        <p className="font-medium"><FormatCurrency fixed amount={itemsBaseTotal} decimals={2} /></p>
                                    </div> : <div className="flex justify-between text-sm">
                                        <p className="text-gray-700">Offer Price:</p>
                                        <p className="font-medium"><FormatCurrency fixed amount={order?.itemsTotal} decimals={2} /></p>
                                    </div>
                                }

                                {(order?.bundleDiscountPercent > 0) && (
                                    <div className="flex justify-between text-sm">
                                        <p className="text-gray-700">Bundle Discount
                                            <span className="bg-green-600/20 text-green-600 rounded px-1 py-0.5 ml-1 text-sm">
                                                {order?.bundleDiscountPercent}%
                                            </span> :</p>
                                        <p className="font-medium text-green-600">-<FormatCurrency fixed amount={(itemsBaseTotal * order?.bundleDiscountPercent / 100)} decimals={2} /></p>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-700">Extra Donation:</p>
                                    <p className="font-medium"><FormatCurrency fixed amount={totalExtraDonation} decimals={2} /></p>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-700 flex flex-row gap-x-1 items-center">Service Fee :
                                    </p>
                                    <p className="font-medium"><FormatCurrency fixed amount={order?.serviceFee} decimals={2} /></p>
                                </div>
                                {order?.authenticationFee > 0 && <div className="flex justify-between text-sm">
                                    <p className="text-gray-700">Verify & Authentication of Goods:</p>
                                    <p className="font-medium"><FormatCurrency fixed amount={order?.authenticationFee} decimals={2} /></p>
                                </div>}
                                {order?.treeCredit > 0 && <div className="flex justify-between text-sm">
                                    <p className="text-gray-700">Gift Trees:</p>
                                    <p className="font-medium"><FormatCurrency fixed amount={order?.treeCredit} decimals={2} /></p>
                                </div>}

                                {order?.totalDelivery > 0 && <div className="flex justify-between text-sm">
                                    <p className="text-gray-700 flex flex-row gap-x-1 items-center">Shipping :
                                    </p>
                                    <p className="font-medium"><FormatCurrency fixed amount={order?.totalDelivery} decimals={2} /></p>
                                </div>}

                                {/* <hr />
                                      <div className="flex justify-between items-center">
                                        <div className="text-gray-700">
                                          <p>Promo code:</p>
                                          <span>(If you have a discount code)</span>
                                        </div>
                                        <Input className="w-1/2 bg-gray-100" placeholder="Enter code" />
                                      </div> */}
                                <hr />
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-800 font-semibold text-base">Total:</p>

                                    <p className="font-semibold text-base"><FormatCurrency fixed amount={order?.totalPrice} decimals={2} /></p>
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>

                </Collapsible>

                <Collapsible>

                    <CollapsibleTrigger asChild>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm cursor-pointer"
                        // onClick={() => orderAction("Delivery details opened")}
                        >
                            Deliver to
                            <ChevronDown className="size-3.5" />
                        </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-2">
                        <div className="space-y-0.5 mt-1">
                            {billingDetails && (
                                <>
                                    {billingDetails?.full_name && (
                                        <h5 className='text-sm font-semibold'>{billingDetails?.full_name}</h5>
                                    )}
                                    {billingDetails?.contact && (
                                        <p className='text-gray-600 text-sm'>{billingDetails?.contact}</p>
                                    )}
                                    {billingDetails?.address1 && (
                                        <p className='text-gray-600 text-sm'>{billingDetails?.address1}</p>
                                    )}
                                    {locationLine && (
                                        <p className='text-gray-600 text-sm'>{locationLine}</p>
                                    )}
                                </>
                            )}
                        </div>
                    </CollapsibleContent>

                </Collapsible>



            </div>
        </div>
    )
}

export default PurchaseItem
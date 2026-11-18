import FormatCurrency from "@/components/shared/FormatCurrency";
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'
import { IAssitedSellRequest, PriceType, ShipmentStatus } from '@/types'
import { defaultImg } from '@/utils/defaultImg'
import { getAssitedPriceTypeFormat, getAssitedSellingStatusFormat, getBundleOrderStatusFormat } from '@/utils/EnumFormater'
import { Package } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import React from 'react'
import ReqAction from './ReqAction'

function SellreqCard({ data }: { data: IAssitedSellRequest }) {
    return (
        <div className='space-y-3 border border-gray-200 p-2'>

            <div className="flex flex-row gap-x-2 items-start w-full">
                <Image
                    src={data?.pictures?.[0]?.url || defaultImg?.product}
                    alt="product_image"
                    width={1200}
                    height={1200}
                    placeholder="blur"
                    blurDataURL={defaultImg?.placeholderImg}
                    className="h-36 w-32 object-cover origin-center"
                ></Image>

                <div className='space-y-1.5 w-full'>
                    <div className='flex flex-row justify-between flex-wrap items-center gap-0.5'>
                        <p className='text-xs text-gray-600'>{moment(data?.createdAt).fromNow()}</p>

                        <div className='flex flex-row items-center gap-2'>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Badge
                                        variant={data?.status == "REJECTED" ? "destructive" : "outline"}
                                        className={(data?.status == "APPROVED" && data?.shipment && data?.shipment?.status !== ShipmentStatus.PENDING) ? cn(getBundleOrderStatusFormat(data?.shipment?.status)?.color, "font-semibold rounded-none") : cn(getAssitedSellingStatusFormat(data?.status)?.color, "font-semibold rounded-none")}>

                                        {(data?.status == "APPROVED" && data?.shipment && data?.shipment?.status !== ShipmentStatus.PENDING) ? getBundleOrderStatusFormat(data?.shipment?.status)?.label : getAssitedSellingStatusFormat(data?.status)?.label}

                                    </Badge>
                                </TooltipTrigger>

                                <TooltipContent className="rounded-none" side="top">
                                    <p className="text-xs">{(data?.status == "APPROVED" && data?.shipment && data?.shipment?.status !== ShipmentStatus.PENDING) ? getBundleOrderStatusFormat(data?.shipment?.status)?.details : getAssitedSellingStatusFormat(data?.status)?.details}</p>
                                </TooltipContent>
                            </Tooltip>

                            <ReqAction data={data} />

                        </div>

                    </div>
                    <p className='text-sm font-semibold line-clamp-1'>{data?.itemsTitle}</p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-1.5 py-0.5 text-xs font-medium text-gray-600">
                        <Package className="size-4" />
                        {data?.itemsCount} Items
                    </span>

                    {data?.donationPct > 0 && <p className='text-sm font-medium line-clamp-2 text-green-800'>{data?.donationPct}% Donation</p>}

                    <div className='flex flex-row gap-x-1 items-center'>
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge
                                    variant={"outline"}
                                    className={(getAssitedPriceTypeFormat(data?.priceType)?.color, "font-semibold rounded-none")}>

                                    {getAssitedPriceTypeFormat(data?.priceType)?.label}

                                </Badge>
                            </TooltipTrigger>

                            <TooltipContent className="rounded-none" side="top">
                                <p className="text-xs">{getAssitedPriceTypeFormat(data?.priceType, (data?.targetPrice || 0))?.details}</p>
                            </TooltipContent>
                        </Tooltip>
                        {data?.priceType == PriceType.TARGET_AMOUNT && <p className='text-base font-semibold'><FormatCurrency fixed amount={data?.targetPrice} decimals={2} /></p>}
                    </div>

                </div>
            </div>

            <div className='flex flex-row gap-x-2 items-center'>
                {/* <Button size={"sm"} variant={"outline"} className='border border-primary-black rounded-none flex-1 cursor-pointer'>Bump Up</Button> */}
                {/* <Button size={"sm"} variant={"outline"} className='border border-destructive rounded-none cursor-pointer text-destructive hover:text-destructive'>Delete</Button> */}
            </div>


        </div>
    )
}

export default SellreqCard
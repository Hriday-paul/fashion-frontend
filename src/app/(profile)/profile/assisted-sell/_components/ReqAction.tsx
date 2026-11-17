"use client"
import React, { useState } from "react"
import { formatSize } from "@/lib/formatSize";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IAssitedSellRequest, IProduct } from "@/types"
import { ChevronRight, CircleX, EllipsisVertical, Eye } from "lucide-react"
import { DltAssitentSellReq } from "@/lib/Actions/AssistentSell.action"
import Image from "next/image"
import { defaultImg } from "@/utils/defaultImg"
import Link from "next/link"
import { useCurrency } from "@/hooks/useCurrency"

function ReqAction({ data }: { data: IAssitedSellRequest }) {

    const [cancelOpen, setCancelOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [isLoading, setIsLoading] = useState(false)

    const handleDeleteRequest = async (reqId: string) => {
        setIsLoading(true)
        try {
            // Call your API to delete the request here
            const res = await DltAssitentSellReq({ id: reqId });
            if (!res.success) {
                throw new Error(res.message);
            }
            setCancelOpen(false); // Close the dialog on success
        } catch (error: any) {
            setError(error?.message || "Failed to delete the request. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>

            {(data?.status !== "APPROVED" || data?.shipment) && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="cursor-pointer flex flex-row items-center gap-x-1 shadow-none">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40 rounded-none p-0" align="end">
                    <DropdownMenuGroup>

                        {data?.status == "LISTED" && (
                            <DropdownMenuItem onSelect={() => { }} className="cursor-pointer p-2 rounded-none">
                                <Eye size={16} />
                                View Listings
                            </DropdownMenuItem>
                        )}

                        {(data?.status == "PENDING" || data?.status == "REJECTED") && <DropdownMenuItem
                            onSelect={() => setCancelOpen(true)} // let the menu close, then open dialog
                            className="cursor-pointer p-2 rounded-none text-red-600 hover:!text-red-600"
                        >
                            <CircleX size={16} className="text-destructive" />
                            Delete Request
                        </DropdownMenuItem>}

                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>}

            <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <AlertDialogContent className="rounded-none w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure to <span className="text-red-600 underline underline-offset-2">Delete</span> the request?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Once you delete the request, it will be removed permanently and you will not be able to recover it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {error && (
                        <p className="text-red-500 text-sm text-center mt-2">
                            {error}
                        </p>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer rounded-none" disabled={isLoading}>No</AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer rounded-none"
                            disabled={isLoading}
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleteRequest(data?.id);
                            }}
                        >
                            {isLoading ? <span className="loader" /> : "Yes, Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ReqAction;

const Listings = ({ listings }: { listings: IProduct[] }) => {
    const { format } = useCurrency();
    return (
        <div className="">
            {listings?.map((product) => (
                <Link href={`/shop/${product?.id}`} key={product?.id}>
                    <div className="flex flex-row gap-x-4 items-center border-b border-border py-2 hover:bg-zinc-100 cursor-pointer">
                        <div className="flex md:flex-row flex-col gap-x-4">
                            <div className="relative">
                                <Image
                                    src={product?.images[0]?.url || defaultImg?.product}
                                    alt="hero image"
                                    width={500}
                                    height={500}
                                    placeholder="blur"
                                    blurDataURL={defaultImg?.placeholderImg}
                                    className="h-28 w-28 rounded object-cover "
                                />
                            </div>

                            <div className="text-base">
                                <p className="text-base">
                                    {product?.title}
                                </p>
                                <p className="text-gray-700">{formatSize(product?.size, product?.SizeFormat)}</p>
                                <p className="text-gray-700">Price: <span className="font-semibold text-primary-black">{format(product?.finalPrice)}</span></p>

                                {/* <p className="text-[#E12728]">Offer Expire in 24 hrs</p> */}
                            </div>
                        </div>

                        <ChevronRight size={20} />

                    </div>
                </Link>
            ))}
        </div>
    )
}
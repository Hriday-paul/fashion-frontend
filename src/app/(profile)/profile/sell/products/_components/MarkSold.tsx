"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useMarkProductSoldMutation } from "@/redux/api/productApi";
import { toast } from "sonner";
import Image from "next/image";

function MarkSold({ productId, title, onMarked }: { productId: string, title?: string, onMarked?: () => void }) {
    const [markSold, { isLoading }] = useMarkProductSoldMutation();

    const handleMarkSold = async () => {
        try {
            await markSold({ productId }).unwrap();
            toast.success("Listing marked as sold");
            onMarked?.();
        } catch (error: any) {
            toast.error(getErrorMessage(error, "Failed to mark listing as sold"));
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size={"sm"} variant={"outline"} disabled={isLoading} className='border border-primary-black h-8 px-2 text-sm font-medium rounded-none cursor-pointer'>Mark Sold</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-none">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-transparent">
                        <Image src="/sold-icon.svg" alt="Sold" width={64} height={64} unoptimized className="size-16" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Are you sure you want to mark this listing as sold?</AlertDialogTitle>
                    <AlertDialogDescription>
                        &quot;{title}&quot; will show as sold out and can no longer be bought. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none cursor-pointer" disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-none cursor-pointer" disabled={isLoading} onClick={handleMarkSold}>
                        Yes, mark as sold
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default MarkSold;

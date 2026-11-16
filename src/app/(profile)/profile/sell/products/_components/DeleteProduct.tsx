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
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useDeleteProductMutation } from "@/redux/api/productApi";
import { toast } from "sonner";

function DeleteProduct({ productId, title, onDeleted }: { productId: string, title?: string, onDeleted?: () => void }) {
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    const handleDelete = async () => {
        try {
            await deleteProduct({ productId }).unwrap();
            toast.success("Listing deleted successfully");
            onDeleted?.();
        } catch (error: any) {
            toast.error(getErrorMessage(error, "Failed to delete listing"));
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size={"sm"} variant={"outline"} disabled={isLoading} className='border border-destructive text-destructive hover:text-destructive h-8 px-2 text-sm font-medium rounded-none cursor-pointer'>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-none">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this listing?</AlertDialogTitle>
                    <AlertDialogDescription>
                        &quot;{title}&quot; will be removed from the shop. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none cursor-pointer" disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="rounded-none cursor-pointer bg-destructive text-white hover:bg-destructive/90"
                        disabled={isLoading}
                        onClick={handleDelete}
                    >
                        Yes, delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteProduct;

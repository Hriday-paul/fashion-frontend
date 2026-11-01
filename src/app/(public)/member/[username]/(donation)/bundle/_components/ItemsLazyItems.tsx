"use client"
import { IMeta, IProduct } from "@/types";
import { useRef, useState } from "react";
import useLazyLoad from "@/hooks/useLazyLoad";
import Image from "next/image";
import ProductCard from "@/components/shared/Cards/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddToCart, DeleteFromCart } from "@/lib/Actions/Cart.action";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useAppDispatch } from "@/redux/hooks";
import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";
import { useLazyProductsGetByMemberQuery } from "@/redux/api/productApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IProductCart extends IProduct {
    cartItems: {
        id: string;
    }[]
}

const ItemsLazyItems = ({ query, userName, initialData, initialMeta }: { query: { [key: string]: string | undefined }, userName: string, initialData: IProductCart[], initialMeta: IMeta }) => {

    const [loadSellerProds, { isLoading }] = useLazyProductsGetByMemberQuery();
    const triggerRef = useRef(null);

    const loadNextPage = async (page: number) => {
        try {

            query.page = page.toString();

            const res = await loadSellerProds({ params: query, userName }).unwrap();
            const data = res?.data?.data || [];
            const meta = res?.data?.meta;

            // No meta or no data back -> treat as end of list
            const hasMore = meta ? meta.page < meta.totalPage : data.length > 0;

            return { data, hasMore };
        } catch (error) {
            return { data: [], hasMore: false };
        }
    }

    const { data, hasMore } = useLazyLoad<any>({
        triggerRef,
        onGrabData: loadNextPage,
        options: {},
        initialData: initialData,
        initialPage: initialMeta?.page ? initialMeta.page + 1 : 2,
        initialHasMore: initialMeta ? initialMeta?.page < initialMeta?.totalPage : true
    });

    return (
        <div>

            {
                data?.length === 0 && !isLoading && <div className="py-20 md:py-24 lg:py-28">
                    <Image src={"/emty-box.png"} unoptimized alt="empty-cart" className="h-16 lg:h-24 w-auto mx-auto" height={500} width={500} />
                    <p className="text-center text-gray-700 text-sm lg:text-lg">No items available</p>
                </div>
            }

            {/* ========================= all products ========================== */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {data?.map((prod) => (
                    <ProductCard data={prod} key={prod?.id} ownProduct={true}>
                        <AddRemoveBundleItems product={prod} />
                    </ProductCard>
                ))}

                {hasMore && <div ref={triggerRef} style={{ height: 1 }} />}
            </div>

            {
                isLoading && hasMore && <div className="flex-center h-28 lg:h-40">
                    <span className="loaderDark !w-10"> </span>
                </div>
            }

        </div>
    );
};

export default ItemsLazyItems;


const AddRemoveBundleItems = ({ product }: { product: IProductCart }) => {

    console.log(product)

    const [isInbundle, setIsInBundle] = useState(product?.cartItems?.length > 0);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const cUserId = useSelector((state : RootState) => state?.auth?.user?.id);

    const handleDltTocart = async (productId: string) => {
        setLoading(true);
        try {
            const res = await DeleteFromCart({ payload: { productId } });

            if (!res.success) {
                throw new Error(res.message);
            }

            dispatch(baseApi.util.invalidateTags([tagTypes.cart]))
            setIsInBundle(false);
        }
        catch (error: any) {
            if (isRedirectError(error)) {
                throw error;
            }
            toast.error(error?.message || "An error occurred while removing from bundle.");
        } finally {
            setLoading(false);
        }
    }

    const handleAddToBundle = async (productId: string) => {

        setLoading(true);

        const payload = {
            productId: productId,
            quantity: 1,
            extraDonation: 0,
            extraDonationAnonymous: false,
            charities: []
        };

        try {
            const res = await AddToCart({ payload });
            if (!res.success) {
                throw new Error(res.message);
            }
            dispatch(baseApi.util.invalidateTags([tagTypes.cart]))
            setIsInBundle(true);

        } catch (error: any) {
            if (isRedirectError(error)) {
                throw error; // Let Next.js handle the redirect
            }
            toast.error(error?.message || "An error occurred while adding to cart.");
        } finally {
            setLoading(false);
        }
    }

    const isOwner = product?.userId === cUserId;

    return !isOwner && <div className="md:-translate-y-2 -translate-y-1">
        {isInbundle ? (
            <Button
                onClick={() =>
                    handleDltTocart(product?.id)
                }
                variant={"outline"}
                className={cn(
                    "w-full cursor-pointer bg-transparent  border-[#E12728] text-[#E12728] hover:bg-[#E12728]/5 hover:text-[#E12728] duration-300 transition-colors h-8 rounded-md"
                )}
            >
                {loading ? <span className="loaderDark !w-7" /> : "Remove"}
            </Button>
        ) : (
            <Button
                onClick={() =>
                    handleAddToBundle(product?.id)
                }
                variant={"outline"}
                className={cn(
                    "w-full cursor-pointer border-[#232323] h-8 rounded-md"
                )}
            >
                {loading ? <span className="loaderDark !w-7" /> : "Added to bundle"}
            </Button>
        )}

    </div>

}
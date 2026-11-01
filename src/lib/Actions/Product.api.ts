"use server"
import { revalidatePath } from "next/cache";
import { serverQueryWithReauth } from "./ReAuthRequest";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const AddNewProduct = async ({ payload }: { payload: FormData }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/products`, method: "POST" });
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Product added successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to add product",
            data: null,
        };
    }
}

export const AddNewOffer = async ({ payload }: { payload: { sellerId: string, offerPrice: number, productIds: string[] } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/products/offer`, method: "POST" });
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Offer submitted successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to send offer",
            data: null,
        };
    }
}

export const AcceptOffer = async ({ payload }: { payload: { offerId: string } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/products/offer/accept`, method: "POST" });
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Offer accepted successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to accept offer",
            data: null,
        };
    }
}

export const DeclineOffer = async ({ payload }: { payload: { offerId: string, offerPrice: number } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/products/offer/decline`, method: "POST" });
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Offer declined successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to decline offer",
            data: null,
        };
    }
}

export const DropPrice = async ({ payload }: { payload: { productId: string, newPrice: number } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/products/price/drop`, method: "POST" });
        revalidatePath("/profile/sell/products");
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Price dropped successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to drop price",
            data: null,
        };
    }
}

export const BuyFromChat = async ({ payload }: { payload: { chatId: string, sellerId: string } }): Promise<{
    success: boolean;
    message: string;
    data: { id: string } | null;
}> => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/chats/buy`, method: "POST" });
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Proceeding to checkout",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to proceed to checkout",
            data: null,
        };
    }
}

export const CreateChat = async ({ payload }: { payload: { products: string[], user2Id: string } }): Promise<{
    success: boolean;
    message: string;
    data: { id: string } | null;
}> => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/chats`, method: "POST" });
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Chat initiated successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to initiate chat",
            data: null,
        };
    }
}

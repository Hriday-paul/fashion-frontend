"use server"
import { revalidatePath } from "next/cache";
import { serverQueryWithReauth } from "./ReAuthRequest";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const makeOrder = async ({ payload }: { payload: { cartGroupId: string, offerId: string, shipmentServiceId: string, treeGiftCount: number, allowedAuthentication: boolean } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/orders`, method: "POST" });
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Order created successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to create order",
            data: null,
        };
    }
}

export const makeOfferOrder = async ({ payload }: { payload: { cartGroupId: string, offerId: string, shipmentServiceId: string, treeGiftCount: number, allowedAuthentication: boolean } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/orders/offer`, method: "POST" });

        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Offer order created successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {

        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to create offer order",
            data: null,
        };
    }
}

export const makeListingOrder = async ({ payload }: { payload: { productId: string, shipmentServiceId: string, treeGiftCount: number, allowedAuthentication: boolean } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/orders/listing`, method: "POST" });

        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Listing order created successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to create listing order",
            data: null,
        };
    }
}

export const GetLebel = async ({ payload }: { payload: { "orderId": string } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/orders/shipping-label/${payload?.orderId}`, method: "POST" });
        revalidatePath(`/profile/sell/orders`);
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Shipping label retrieved successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to retrieve shipping label",
            data: null,
        };
    }
}

export const CancelOrderItems = async ({ payload }: { payload: FormData }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/orders/items/cancel`, method: "POST" });
        revalidatePath(`/profile/sell/orders`);
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Order items cancelled successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to cancel order items",
            data: null,
        };
    }
}

export const ApproveCancelRequest = async ({ payload }: { payload: { "orderItemId": string } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/orders/items/cancel/approve`, method: "PATCH" });
        revalidatePath(`/profile/sell/orders`);
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Cancel request approved successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to approve cancel request",
            data: null,
        };
    }
}

export const RequestCancelItem = async ({ payload }: { payload: FormData }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/orders/items/cancel/request`, method: "POST" });
        revalidatePath(`/profile/purchase/orders`);
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Cancel request submitted successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to submit cancel request",
            data: null,
        };
    }
}

export const DeclineCancelRequest = async ({ payload }: { payload: { "orderItemId": string } }) => {
    try {
        const res = await serverQueryWithReauth({ payload, endPoint: `/orders/items/cancel/decline`, method: "PATCH" });
        revalidatePath(`/profile/sell/orders`);
        return {
            success: res?.success !== undefined ? Boolean(res.success) : true,
            message: res?.message || "Cancel request declined successfully",
            data: res?.data !== undefined ? res.data : (res ?? null),
        };
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Failed to decline cancel request",
            data: null,
        };
    }
}
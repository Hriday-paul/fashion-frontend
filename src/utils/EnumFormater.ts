import { OrderStatus, CurrentShipTo, OrderAuthStatus, CancelReason, AssistentSellStatus, PriceType, IBadgeType, PaymentStatus, StripePaymentStatus, ShipmentStatus, IShipment, IOrder } from "@/types"

export const getOrderStatusFormat = (
    order : IOrder
): { label: string; color: string; details: string } => {

    const {status, shipment, authShipment, currentShipTo, allowedAuthentication, authStatus} = order;

    const isAuthCenter = currentShipTo === CurrentShipTo.AUTHENTICATION_CENTER;

    //authentication allow & current going to buyer, shipment will be auth shipment, else shipment will be buyer shipment
    const currentShipment = (allowedAuthentication && !isAuthCenter) ? authShipment : shipment;

    switch (status) {
        case OrderStatus.PENDING:
            return {
                label: "Pending",
                color: "bg-yellow-100 text-yellow-800",
                details: "Order has been placed and is awaiting processing.",
            }

        case OrderStatus.SHIPPING:
            if (currentShipment) {
                switch (currentShipment?.status) {
                    case ShipmentStatus.PICKED_UP:
                        return isAuthCenter
                            ? {
                                label: "Picked Up for Auth",
                                color: "bg-blue-100 text-blue-800",
                                details: "Item has been picked up and is on its way to the Authentication Center.",
                            }
                            : {
                                label: "Picked Up",
                                color: "bg-blue-100 text-blue-800",
                                details: "Item has been picked up by the courier.",
                            }
                    case ShipmentStatus.IN_TRANSIT:
                        return isAuthCenter
                            ? {
                                label: "In Transit to Auth",
                                color: "bg-indigo-100 text-indigo-800",
                                details: "Item is in transit to the Authentication Center.",
                            }
                            : {
                                label: "In Transit",
                                color: "bg-indigo-100 text-indigo-800",
                                details: "Item is in transit and out for delivery to the buyer.",
                            }
                    case ShipmentStatus.OUT_FOR_DELIVERY:
                        return isAuthCenter
                            ? {
                                label: "Out for Delivery to Auth",
                                color: "bg-purple-100 text-purple-800",
                                details: "Item is out for delivery to the Authentication Center.",
                            }
                            : {
                                label: "Out for Delivery",
                                color: "bg-purple-100 text-purple-800",
                                details: "Item is out for delivery to the buyer.",
                            }
                    case ShipmentStatus.DELIVERED:
                        if (!isAuthCenter) {
                            return {
                                label: "Delivered",
                                color: "bg-purple-100 text-purple-800",
                                details: "Item has been delivered to the buyer.",
                            }
                        }
                        switch (authStatus) {
                            case OrderAuthStatus.ITEM_RECEIVED:
                                return {
                                    label: "Auth: Received",
                                    color: "bg-purple-100 text-purple-800",
                                    details: "Item has been received at the Authentication Center and is awaiting review.",
                                }
                            case OrderAuthStatus.IN_PROGRESS:
                                return {
                                    label: "Auth: In Progress",
                                    color: "bg-purple-100 text-purple-800",
                                    details: "Item is currently being authenticated.",
                                }
                            case OrderAuthStatus.RESPONDED:
                                return {
                                    label: "Auth: Responded",
                                    color: "bg-purple-100 text-purple-800",
                                    details: "Authentication has been completed and a response has been issued.",
                                }
                            case OrderAuthStatus.NOT_STARTED:
                            default:
                                return {
                                    label: "Delivered to Auth",
                                    color: "bg-purple-100 text-purple-800",
                                    details: "Item has been delivered to the Authentication Center. Review has not started yet.",
                                }
                        }
                    case ShipmentStatus.CANCELLED:
                        return {
                            label: "Shipment Cancelled",
                            color: "bg-red-500",
                            details: "Shipment has been cancelled.",
                        }
                    case ShipmentStatus.PENDING:
                    default:
                        break;
                }
            }

            return isAuthCenter
                ? {
                    label: "Shipping to Auth",
                    color: "bg-blue-100 text-blue-800",
                    details: "Item is shipping and on its way to the Authentication Center.",
                }
                : {
                    label: "Shipping",
                    color: "bg-blue-100 text-blue-800",
                    details: "Item is shipping and on its way to the buyer.",
                }

        case OrderStatus.COMPLETED:
            return {
                label: "Completed",
                color: "bg-green-500",
                details: "Order has been completed.",
            }

        case OrderStatus.CANCELLED:
            return {
                label: "Cancelled",
                color: "bg-red-500 text-white",
                details: "Order has been cancelled.",
            }

        default:
            return {
                label: "Unknown",
                color: "bg-gray-100 text-gray-800",
                details: "Status unavailable.",
            }
    }
}

export const CancelReasonFormat: Record<CancelReason, { label: string; color: string }> = {
    // Buyer-initiated reasons
    CHANGED_MIND: { label: "Changed Mind", color: "bg-gray-100 text-gray-800" },
    FOUND_BETTER_PRICE: { label: "Found Better Price", color: "bg-blue-100 text-blue-800" },
    ORDERED_BY_MISTAKE: { label: "Ordered by Mistake", color: "bg-gray-100 text-gray-800" },
    ITEM_NO_LONGER_NEEDED: { label: "Item No Longer Needed", color: "bg-gray-100 text-gray-800" },
    DELIVERY_TOO_LONG: { label: "Delivery Too Long", color: "bg-yellow-100 text-yellow-800" },
    FOUND_BETTER_PRODUCT: { label: "Found Better Product", color: "bg-blue-100 text-blue-800" },
    WRONG_ITEM_SELECTED: { label: "Wrong Item Selected", color: "bg-gray-100 text-gray-800" },
    DUPLICATE_ORDER: { label: "Duplicate Order", color: "bg-gray-100 text-gray-800" },
    SHIPPING_COST_TOO_HIGH: { label: "Shipping Cost Too High", color: "bg-yellow-100 text-yellow-800" },
    PAYMENT_ISSUE: { label: "Payment Issue", color: "bg-red-100 text-red-800" },
    SELLER_UNRESPONSIVE: { label: "Seller Unresponsive", color: "bg-red-100 text-red-800" },

    // Seller-initiated reasons
    OUT_OF_STOCK: { label: "Out of Stock", color: "bg-orange-100 text-orange-800" },
    UNABLE_TO_FULFILL_IN_TIME: { label: "Unable to Fulfill in Time", color: "bg-orange-100 text-orange-800" },
    PRICING_ERROR: { label: "Pricing Error", color: "bg-orange-100 text-orange-800" },
    BUYER_UNREACHABLE: { label: "Buyer Unreachable", color: "bg-red-100 text-red-800" },
    SUSPECTED_FRAUD: { label: "Suspected Fraud", color: "bg-red-100 text-red-800" },
    SHIPPING_ADDRESS_ISSUE: { label: "Shipping Address Issue", color: "bg-yellow-100 text-yellow-800" },
    LISTING_ERROR: { label: "Listing Error", color: "bg-orange-100 text-orange-800" },
    BUYER_REQUESTED: { label: "Buyer Requested", color: "bg-blue-100 text-blue-800" },
    DAMAGED_INVENTORY: { label: "Damaged Inventory", color: "bg-red-100 text-red-800" },
    PAYMENT_NOT_VERIFIED: { label: "Payment Not Verified", color: "bg-red-100 text-red-800" },

    OTHER: { label: "Other", color: "bg-gray-100 text-gray-800" },
}

export const getShipmentStatusFormat = (
    status: ShipmentStatus,
): { label: string; color: string; details: string } => {
    switch (status) {
        case ShipmentStatus.PENDING:
            return {
                label: "Pending",
                color: "bg-yellow-100 text-yellow-800",
                details: "Shipment is waiting for processing.",
            }

        case ShipmentStatus.PICKED_UP:
            return {
                label: "Picked Up",
                color: "bg-blue-100 text-blue-800",
                details: "Package has been picked up by the courier.",
            }

        case ShipmentStatus.IN_TRANSIT:
            return {
                label: "In Transit",
                color: "bg-indigo-100 text-indigo-800",
                details: "Package is in transit.",
            }

        case ShipmentStatus.OUT_FOR_DELIVERY:
            return {
                label: "Out for Delivery",
                color: "bg-purple-100 text-purple-800",
                details: "Package is out for delivery.",
            }

        case ShipmentStatus.DELIVERED:
            return {
                label: "Delivered",
                color: "bg-purple-100 text-purple-800",
                details: "Package has been delivered.",
            }

        case ShipmentStatus.CANCELLED:
            return {
                label: "Cancelled",
                color: "bg-red-500",
                details: "Shipment has been cancelled.",
            }

        default:
            return {
                label: "Unknown",
                color: "bg-gray-100 text-gray-800",
                details: "Status unavailable.",
            }
    }
}

export const getBundleOrderStatusFormat = (
    status: ShipmentStatus,
): { label: string; color: string; details: string } => {
    switch (status) {
        case ShipmentStatus.PENDING:
            return {
                label: "Pending",
                color: "bg-yellow-100 text-yellow-800",
                details: "Request shipment is waiting for processing.",
            }

        case ShipmentStatus.PICKED_UP:
            return {
                label: "Picked Up",
                color: "bg-blue-100 text-blue-800",
                details: "Items have been picked up and are on their way to the FASHI-ON team.",
            }

        case ShipmentStatus.IN_TRANSIT:
            return {
                label: "In Transit",
                color: "bg-indigo-100 text-indigo-800",
                details: "Item is in transit and on its way to the FASHI-ON team.",
            }

        case ShipmentStatus.OUT_FOR_DELIVERY:
            return {
                label: "Out for Delivery",
                color: "bg-purple-100 text-purple-800",
                details: "Item is in transit and out for delivery to the FASHI-ON team.",
            }

        case ShipmentStatus.DELIVERED:
            return {
                label: "Delivered",
                color: "bg-purple-100 text-purple-800",
                details: "Item has been delivered to the FASHI-ON team.",
            }

        case ShipmentStatus.CANCELLED:
            return {
                label: "Cancelled",
                color: "bg-red-500",
                details: "Shipment has been cancelled.",
            }

        default:
            return {
                label: "Unknown",
                color: "bg-gray-100 text-gray-800",
                details: "Status unavailable.",
            }
    }
}

export const getAssitedSellingStatusFormat = (
    status: AssistentSellStatus,
): { label: string; color: string; details: string } => {

    switch (status) {
        case AssistentSellStatus.PENDING:
            return {
                label: "Pending",
                color: "bg-yellow-100 text-yellow-800",
                details: "Request is waiting for response from the FASHI-ON team.",
            }

        case AssistentSellStatus.APPROVED:
            return {
                label: "Approved",
                color: "bg-green-100 text-green-800",
                details: "Request has been approved by the FASHI-ON team.",
            }

        case AssistentSellStatus.REJECTED:
            return {
                label: "Rejected",
                color: "bg-red-100 text-red-800",
                details: "Request has been rejected by the FASHI-ON team.",
            }

        case AssistentSellStatus.LISTED:
            return {
                label: "Listed",
                color: "bg-blue-100 text-blue-800",
                details: "Items have been listed and are on their way to the FASHI-ON team.",
            }

        default:
            return {
                label: "Unknown",
                color: "bg-gray-100 text-gray-800",
                details: "Status unavailable.",
            }
    }
}

export const getAssitedPriceTypeFormat = (
    status: PriceType,
    targetAmount?: number | string,
): { label: string; color: string; details: string } => {

    switch (status) {
        case PriceType.DISCUSSION:
            return {
                label: "Discussion",
                color: "bg-yellow-100 text-yellow-800",
                details: "Price is open for discussion and negotiation.",
            }

        case PriceType.TARGET_AMOUNT:
            const displayAmount = typeof targetAmount === "string" ? targetAmount : `£${targetAmount?.toFixed(2)}`;
            return {
                label: "Target Amount",
                color: "bg-green-100 text-green-800",
                details: `Want to earn minimum ${displayAmount} amount from the sale.`,
            }

        case PriceType.MARKET_PRICE:
            return {
                label: "Market Price",
                color: "bg-blue-100 text-blue-800",
                details: "Price is based on the current market value of the item.",
            }

        default:
            return {
                label: "Unknown",
                color: "bg-gray-100 text-gray-800",
                details: "Status unavailable.",
            }
    }
}

export const BadgeIcons: Record<IBadgeType, string> = {
    FASHION_PHILANTHROPIST: "/badges/heart-handshake.svg",
    STYLE_STARTER: "/badges/sparkles.svg",
    FIRST_PURCHASE: "/badges/shopping-bag.svg",
    MONEY_DONOR: "/badges/circle-dollar-sign.svg",
    ECO_HERO: "/badges/cannabis.svg",
    FIRST_SALE: "/badges/badge-check.svg",
    TREE_PLANTER: "/badges/sprout.svg",
    CLOTHING_DONOR: "/badges/shirt.svg",
    FREQUENT_SELLER: "/badges/package-open.svg",
    TOP_BUYER: "/badges/circle-star.svg",
    SPEEDY_SHIPPER: "/badges/rocket.svg",
    FASHION_ACTIVIST: "/badges/award.svg",
    TRUSTED_SELLER: "/badges/shield-check.svg",
    CHARITY_SUPPORTER: "/badges/heart-handshake.svg",
    SUSTAINABLE_MATERIALS: "/badges/recycle.svg",
    FAST_SHIPPER: "/badges/truck.svg",
    TOP_ECO_SELLER: "/badges/leaf.svg",
    BUYERS_FAVOURITE: "/badges/heart.svg",
    CHARITY_CHAMPION: "/badges/heart-plus.svg",
    TOP_CHARITY_FUNDRAISER: "/badges/trophy.svg",
    VINTAGE_COLLECTION: "/badges/clock.svg"
}

export const EarningStatus = (stripStatus: StripePaymentStatus) => {
    switch (stripStatus) {
        case StripePaymentStatus.ESCROWED:
            return {
                label: "Pending",
                color: "bg-yellow-100 text-yellow-800",
                details: "Payment is pending and will be processed soon.",
            }
        case StripePaymentStatus.PENDING:
            return {
                label: "Pending",
                color: "bg-yellow-100 text-yellow-800",
                details: "Payment is pending and will be processed soon.",
            }
        case StripePaymentStatus.RELEASED:
            return {
                label: "Released",
                color: "bg-green-100 text-green-800",
                details: "Payment has been received and processed.",
            }
        case StripePaymentStatus.REFUNDED:
            return {
                label: "Refunded",
                color: "bg-red-100 text-red-800",
                details: "Payment has been refunded.",
            }
        default:
            return {
                label: "Unknown",
                color: "bg-gray-100 text-gray-800",
                details: "Status unavailable.",
            }
    }
}
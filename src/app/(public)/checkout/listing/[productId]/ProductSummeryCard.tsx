import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { OrderSummeryType } from "@/types";
import GetProductDetails from "@/lib/services/ProductDetails";
import { IProductWithUser } from "@/app/(public)/shop/[productId]/_components/ProductDetails/ProductDetails";
import ProductSummeryTotal from "./_components/ProductSummeryTotal";
import AuthenticationCard from "../../cart/[cartGroupId]/_components/AuthenticationCard";
import DonationCard from "../../cart/[cartGroupId]/_components/DonationCard";
import ProcessOrder from "../../cart/[cartGroupId]/_components/ProcessOrder";


const ProductSummaryCard = ({ productId }: { productId: string }) => {

    const detailPromise = GetProductDetails({ id: productId });

    return (
        <>

            <Suspense key={Date.now()} fallback={<div className="flex-center h-40 bg-white">
                <span className="loaderDark !w-12"> </span>
            </div>}>

                <div className="space-y-5">
                    <SummaryOverview summeryPromise={detailPromise} offerId={productId} />

                </div>

            </Suspense>

        </>
    );
};

export default ProductSummaryCard;

const SummaryOverview = async ({ summeryPromise, offerId }: { summeryPromise: Promise<{ data: IProductWithUser }>, offerId: string }) => {

    const data = await summeryPromise;

    const details = data?.data;

    const totalSummery: OrderSummeryType = {
        itemTotal: details?.finalPrice,
        bundleDiscountAmount: 0,
        bundleDiscountPercent: 0,
        serviceFeeCost: 2.30,
        haveAnyUnavailableItems: false,
        itemsCount: 1,
        subTotal: details?.finalPrice,
        totalExtraDonation: 0,
    }

    return (
        <>
            <Card className=" hover:border hover:border-primary-color/50 duration-300 text-black h-fit rounded-none">
                <CardHeader className="mb-0">
                    <CardTitle className="font-semibold text-center">
                        Total Order Summary
                    </CardTitle>
                </CardHeader>
                <ProductSummeryTotal summery={totalSummery} cartGroupId={offerId} />
            </Card>

            <AuthenticationCard cartGroupId={offerId} />

            <DonationCard cartGroupId={offerId} />

            <ProcessOrder cartGroupId={offerId} mode="listing" haveAnyUnavailableItems={totalSummery?.haveAnyUnavailableItems} />

        </>
    )
}

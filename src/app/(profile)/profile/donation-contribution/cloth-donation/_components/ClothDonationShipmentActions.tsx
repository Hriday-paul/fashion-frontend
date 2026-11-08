"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, FileDown, Truck } from "lucide-react";
import { toast } from "sonner";
import {
  IClothDonation,
  useGetClothDonationShippingLabelMutation,
  useGetClothDonationShippingRatesQuery,
  usePayClothDonationShippingCostMutation,
} from "@/redux/api/donation.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyCourierServices } from "@/app/(public)/checkout/cart/[cartGroupId]/_components/CourierServiceCards";
import { cn } from "@/lib/utils";

interface ClothDonationShipmentActionsProps {
  donation: IClothDonation;
}

export default function ClothDonationShipmentActions({
  donation,
}: ClothDonationShipmentActionsProps) {
  const [ratesDialogOpen, setRatesDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const router = useRouter();

  const isApproved =
    donation?.status === "ACCEPTED" ||
    (donation?.status as string) === "APPROVED";

  const isPaid = Boolean(donation?.shipment?.isPaid);

  const {
    data: ratesRes,
    isLoading: isLoadingRates,
    isFetching: isFetchingRates,
  } = useGetClothDonationShippingRatesQuery(
    { donationReqId: donation.id },
    {
      skip: !ratesDialogOpen || !isApproved || isPaid,
      refetchOnMountOrArgChange: true,
    }
  );

  const [payShippingCost, { isLoading: isPaying }] =
    usePayClothDonationShippingCostMutation();

  const [getShippingLabel, { isLoading: isGettingLabel }] =
    useGetClothDonationShippingLabelMutation();

  if (!isApproved) {
    return null;
  }

  const rates = ratesRes?.data?.rates || [];

  const handleSelectCourierAndPay = async (shipmentServiceId: string) => {
    if (isPaying) return;
    setSelectedServiceId(shipmentServiceId);
    try {
      const res = await payShippingCost({
        donationReqId: donation.id,
        shipmentServiceId,
      }).unwrap();

      const checkoutUrl = res?.data;
      if (!checkoutUrl || typeof checkoutUrl !== "string") {
        throw new Error(res?.message || "Failed to initiate payment");
      }

      router.replace(checkoutUrl);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to initiate shipping payment"
      );
      setSelectedServiceId(null);
    }
  };

  const handleGetShippingLabel = async () => {
    if (donation?.shipment?.lebelUrl) {
      window.open(
        donation.shipment.lebelUrl,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    try {
      const res = await getShippingLabel({
        donationReqId: donation.id,
      }).unwrap();

      const labelUrl =
        typeof res?.data === "string"
          ? res.data
          : res?.data?.labelUrl || res?.data?.url;

      if (!labelUrl) {
        throw new Error(res?.message || "Failed to retrieve shipping label");
      }

      window.open(labelUrl, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to retrieve shipping label"
      );
    }
  };

  return (
    <>
      {isPaid ? (
        <Button
          type="button"
          size="sm"
          onClick={handleGetShippingLabel}
          disabled={isGettingLabel}
          className="rounded-none shadow-none cursor-pointer gap-1.5 text-xs font-medium"
        >
          {isGettingLabel ? (
            <div className="w-4 aspect-square rounded-full border-[2px] border-white border-r-gray-400 animate-spin" />
          ) : (
            <>
              <FileDown className="size-3.5" />
              Get Shipping Label
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          onClick={() => setRatesDialogOpen(true)}
          className="rounded-none shadow-none cursor-pointer gap-1.5 text-xs font-medium"
        >
          <CreditCard className="size-3.5" />
          Pay Shipping Cost
        </Button>
      )}

      {/* Courier Services Modal */}
      <Dialog open={ratesDialogOpen} onOpenChange={setRatesDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-none">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Truck className="size-5" />
              Select a Courier Service
            </DialogTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Click on a courier service below to proceed to shipping payment.
            </p>
          </DialogHeader>

          <div className="pt-3">
            {isLoadingRates || isFetchingRates ? (
              <div className="flex items-center justify-center h-40">
                <span className="loaderDark !w-10" />
              </div>
            ) : !rates || rates.length === 0 ? (
              <EmptyCourierServices />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rates.map((rate) => {
                  const serviceId = rate?.courier_service?.id;
                  const isThisPaying =
                    isPaying && selectedServiceId === serviceId;

                  return (
                    <button
                      key={serviceId}
                      type="button"
                      disabled={isPaying}
                      onClick={() => handleSelectCourierAndPay(serviceId)}
                      className={cn(
                        "border border-gray-300 rounded p-5 flex flex-col items-start text-left cursor-pointer hover:bg-zinc-50 hover:border-primary-black transition-colors relative disabled:opacity-60 disabled:cursor-not-allowed",
                        isThisPaying && "border-primary-black bg-zinc-50"
                      )}
                    >
                      <div className="flex justify-between items-center gap-3 w-full mb-1">
                        <Image
                          src={rate?.courier_service?.logo}
                          alt={rate?.courier_service?.name || "Courier"}
                          width={100}
                          height={100}
                          className="h-8 w-auto object-cover"
                        />
                        {isThisPaying && (
                          <div className="w-5 aspect-square rounded-full border-[2px] border-primary-black border-r-gray-400 animate-spin" />
                        )}
                      </div>
                      <p className="text-lg font-bold text-primary-black">
                        ${rate?.total_charge?.toFixed(2)}
                      </p>
                      <p className="text-primary-black font-medium">
                        {rate?.courier_service?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Delivery within {rate?.min_delivery_time} -{" "}
                        {rate?.max_delivery_time} days
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


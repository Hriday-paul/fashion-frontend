"use client";
import UpdateSellingAddress from "@/app/(profile)/profile/address/_components/UpdateSellingAddress";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserAddressesQuery } from "@/redux/api/userApi";
import { Pencil } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface UpdateShippingAddressProps {
  hasError?: boolean;
  className?: string;
}

function UpdateShippingAddress({
  hasError = false,
  className,
}: UpdateShippingAddressProps = {}) {
  const { isLoading, isSuccess, data: response } = useUserAddressesQuery();

  const sellingAddress = response?.data?.sellingAddress;

  const data = {
    data: sellingAddress || null,
  };

  const locationParts = [
    data?.data?.zip_code,
    data?.data?.state,
    data?.data?.city,
    data?.data?.country,
  ].filter(Boolean);

  const locationLine = locationParts.join(", ");

  const hasAddressData = Boolean(
    data?.data &&
      (data.data.full_name ||
        data.data.contact ||
        data.data.address1 ||
        locationLine)
  );

  return (
    <div className={className}>
      {isLoading ? (
        <Skeleton className="w-full h-20" />
      ) : (
        <UpdateSellingAddress
          defaultdata={sellingAddress || null}
          className="w-full"
          actionBtn={
            <div
              className={cn(
                "p-5 border rounded-lg relative hover:bg-gray-50 duration-150 cursor-pointer w-full text-left transition-colors",
                hasError
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-200 bg-white"
              )}
            >
              {hasAddressData ? (
                <>
                  {data?.data?.full_name && (
                    <h5 className="text-lg font-semibold">{data.data.full_name}</h5>
                  )}
                  {data?.data?.contact && (
                    <p className="text-gray-600">{data.data.contact}</p>
                  )}
                  {data?.data?.address1 && (
                    <p className="text-gray-600">{data.data.address1}</p>
                  )}
                  {locationLine && (
                    <p className="text-gray-600">{locationLine}</p>
                  )}
                </>
              ) : (
                <p
                  className={cn(
                    "text-base font-medium",
                    hasError ? "text-red-500" : "text-gray-600"
                  )}
                >
                  + Add Address
                </p>
              )}

              <Pencil
                className={cn(
                  "absolute top-2 md:top-3 lg:top-4 right-2 md:right-3 lg:right-4 size-5",
                  hasError ? "text-red-500" : "text-gray-600"
                )}
              />
            </div>
          }
        />
      )}
    </div>
  );
}

export default UpdateShippingAddress;

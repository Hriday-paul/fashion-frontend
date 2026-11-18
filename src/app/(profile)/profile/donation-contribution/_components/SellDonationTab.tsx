"use client";

import FormatCurrency from "@/components/shared/FormatCurrency";
import React from "react";
import { useGetSellDonationContributedQuery } from "@/redux/api/donation.api";
import { ISelldonation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { defaultImg } from "@/utils/defaultImg";
import EmptyContributionState from "./EmptyContributionState";

function SellDonationTab() {
  const { data, isLoading } = useGetSellDonationContributedQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const list: ISelldonation[] = Array.isArray(data?.data)
    ? data.data
    : data?.data?.data || [];

  if (isLoading) {
    return (
      <div className="flex-center h-40 lg:h-52">
        <span className="loaderDark !w-10" />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <EmptyContributionState
        icon={Package}
        title="No sell donation contributions yet"
        description="When you pledge a percentage of your listing sales to a charity and an item sells, your contributions will appear here."
      />
    );
  }

  return (
    <div className="divide-y divide-black/10">
      {list.map((don) => {
        const charity = don?.charity;
        const charityThumb =
          charity?.charityThumbnail?.url ||
          charity?.picture?.url ||
          defaultImg?.empty_user;
        const charityName =
          `${charity?.fname || ""} ${charity?.lname || ""}`.trim() ||
          charity?.userName ||
          "Charity";
        const product = don?.orderItem?.product;
        const productImage = product?.images?.[0]?.url;
        const categoryName = product?.category?.name;
        const donatedDate = don?.donatedAt || don?.createdAt;

        return (
          <div
            key={don?.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 hover:bg-zinc-50/60 px-2 rounded-lg transition-colors"
          >
            {/* Left: Charity Thumbnail + Info */}
            <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
              <Link
                href={charity?.userName ? `/member/${charity.userName}` : "#"}
                className="shrink-0"
              >
                <div className="relative h-16 w-20 sm:h-16 sm:w-24 rounded-md overflow-hidden border border-gray-200 bg-gray-100">
                  <Image
                    src={charityThumb}
                    alt={charityName}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={
                      charity?.userName ? `/member/${charity.userName}` : "#"
                    }
                    className="text-base sm:text-lg font-semibold text-gray-900 hover:underline truncate"
                  >
                    {charityName}
                  </Link>
                  {don?.isAnonymous && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0.5 h-5 font-normal"
                    >
                      Anonymous
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                {product?.title && (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
                    {productImage && (
                      <Image
                        src={productImage}
                        alt={product.title}
                        width={22}
                        height={22}
                        className="size-5.5 rounded object-cover border border-gray-200 shrink-0"
                      />
                    )}
                    <span className="font-medium truncate max-w-[240px] sm:max-w-xs">
                      {product.title}
                    </span>
                    {categoryName && (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        · <Tag className="size-3.5" /> {categoryName}
                      </span>
                    )}
                  </div>
                )}

                {/* Date */}
                {donatedDate && (
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      Donated {moment(donatedDate).format("MMM DD, YYYY")} (
                      {moment(donatedDate).fromNow()})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Amount */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pl-[96px] sm:pl-0">
              <p className="text-lg sm:text-xl font-semibold tabular-nums text-green-700">
                <FormatCurrency fixed amount={Number(don?.amount ?? 0)} decimals={2} />
              </p>
              <span className="text-xs text-muted-foreground">
                Sell Donation
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SellDonationTab;


"use client";

import FormatCurrency from "@/components/shared/FormatCurrency";
import React, { useState } from "react";
import { useGetExtraDonationsRaisedListQuery } from "@/redux/api/donation.api";
import { ISelldonation } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Gift,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { Pagination } from "react-pagination-bar";
import { cn } from "@/lib/utils";
import EmptyContributionState from "../../donation-contribution/_components/EmptyContributionState";
import ThanksMessageDialog from "./ThanksMessageDialog";

function getStatusBadge(status?: string) {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        className: "bg-green-50 text-green-700 border-green-200",
      };
    case "FAILED":
      return {
        label: "Failed",
        className: "bg-red-50 text-red-700 border-red-200",
      };
    default:
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
  }
}

function ExtraDonationRaisedTab() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetExtraDonationsRaisedListQuery(
    { page, limit },
    { refetchOnMountOrArgChange: true }
  );

  const list: ISelldonation[] = Array.isArray(data?.data)
    ? data.data
    : data?.data?.data || [];

  const meta = !Array.isArray(data?.data) ? data?.data?.meta : data?.meta;

  if (isLoading || isFetching) {
    return (
      <div className="flex-center h-40 lg:h-52">
        <span className="loaderDark !w-10" />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <EmptyContributionState
        icon={Gift}
        title="No extra donations raised yet"
        description="Additional donations added by buyers during checkout for your charity will appear here."
      />
    );
  }

  return (
    <div>
      <div className="divide-y divide-black/10">
        {list.map((don) => {
          const product = don?.orderItem?.product;
          const productId = don?.orderItem?.productId;
          const productImage = product?.images?.[0]?.url;
          const productTitle =
            product?.title || "Buyer Checkout Extra Donation";
          const donatedDate = don?.donatedAt || don?.createdAt;
          const statusInfo = getStatusBadge(don?.status);

          return (
            <div
              key={don?.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 hover:bg-zinc-50/60 px-2 rounded-lg transition-colors"
            >
              {/* Left: Thumbnail / Icon + Details */}
              <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                {productImage ? (
                  <Link
                    href={productId ? `/shop/${productId}` : "#"}
                    className="shrink-0"
                  >
                    <div className="relative size-14 sm:size-16 rounded-md overflow-hidden border border-gray-200 bg-gray-100">
                      <Image
                        src={productImage}
                        alt={productTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="size-12 sm:size-14 rounded-lg bg-green-600/10 text-green-800 flex items-center justify-center shrink-0">
                    <Gift className="size-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {productId ? (
                      <Link
                        href={`/shop/${productId}`}
                        className="text-base font-semibold text-gray-900 hover:underline truncate"
                      >
                        {productTitle}
                      </Link>
                    ) : (
                      <span className="text-base font-semibold text-gray-900 truncate">
                        {productTitle}
                      </span>
                    )}

                    {/* <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-2 py-0.5 h-5 font-semibold",
                        statusInfo.className
                      )}
                    >
                      {statusInfo.label}
                    </Badge> */}

                    {don?.isAnonymous && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 h-5 font-normal"
                      >
                        Anonymous
                      </Badge>
                    )}
                  </div>

                  {donatedDate && (
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {don?.donatedAt ? "Donated" : "Created"}{" "}
                        {moment(donatedDate).format("MMM DD, YYYY")} (
                        {moment(donatedDate).fromNow()})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Extra Amount + Thank You Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pl-[64px] sm:pl-0">
                <div className="flex flex-col sm:items-end">
                  <p className="text-lg sm:text-xl font-semibold tabular-nums text-green-700">
                    <FormatCurrency fixed amount={Number(don?.extra_money ?? 0)} decimals={2} />
                  </p>
                  {/* <span className="text-xs text-muted-foreground">
                    Extra Donation
                  </span> */}
                </div>

                <ThanksMessageDialog
                  referenceId={don?.id}
                  msgType="SELL"
                  existingMsg={don?.thanksMessage || don?.thanksMsg}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {meta && meta.total > (meta.limit || limit) && (
        <div className="pt-6 flex justify-center">
          <Pagination
            currentPage={page}
            itemsPerPage={meta.limit || limit}
            onPageChange={(pageNumber) => setPage(pageNumber)}
            totalItems={meta.total || 0}
            pageNeighbours={1}
            startLabel={null}
            prevLabel={<ChevronLeft className="size-3.5" />}
            nextLabel={<ChevronRight className="size-3.5" />}
            onlyPageNumbers={true}
            endLabel={null}
            customClassNames={{
              rpbItemClassName:
                "rounded px-2.5 h-7 cursor-pointer border border-gray-200 ml-1.5 text-sm",
              rpbItemClassNameActive:
                "border-none bg-primary-black text-white",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ExtraDonationRaisedTab;


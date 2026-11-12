"use client";

import React, { useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { Calendar, Gift } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useLazyLoad from "@/hooks/useLazyLoad";
import { useLazyGetMemberExtraDonationsRaisedQuery } from "@/redux/api/donation.api";
import { defaultImg } from "@/utils/defaultImg";

interface ExtraDonationRaisedListProps {
  userName: string;
  onItemClick: () => void;
}

export default function ExtraDonationRaisedList({
  userName,
  onItemClick,
}: ExtraDonationRaisedListProps) {
  const [loadData] = useLazyGetMemberExtraDonationsRaisedQuery();
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const loadNextPage = useCallback(
    async (page: number) => {
      try {
        const res = await loadData({ userName, page, limit: 10 }).unwrap();
        const data = res?.data?.data || [];
        const meta = res?.data?.meta;
        const hasMore = meta ? meta.page < meta.totalPage : data.length >= 10;
        return { data, hasMore };
      } catch (err) {
        return { data: [], hasMore: false };
      }
    },
    [loadData, userName]
  );

  const { data, loading, hasMore } = useLazyLoad<any>({
    triggerRef,
    onGrabData: loadNextPage,
    options: {},
  });

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-2 flex flex-col">
      <div className="divide-y divide-gray-100">
        {data.map((item) => {
        const product = item?.orderItem?.product;
        const productId = item?.orderItem?.productId || product?.id;
        const productImage = product?.images?.[0]?.url;
        const productTitle = product?.title || "Buyer Checkout Extra Donation";
        const isAnonymous = Boolean(item?.isAnonymous);
        const donatedDate = item?.donatedAt || item?.createdAt;
        const extraAmount = Number(item?.extra_money ?? item?.amount ?? 0);
        const buyer = item?.orderItem?.order?.buyer;

        return (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 py-3.5 hover:bg-zinc-50/70 px-2 rounded-none transition-colors"
          >
            {/* Left: Thumbnail + Info */}
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              {productImage ? (
                <Link
                  href={productId ? `/shop/${productId}` : "#"}
                  onClick={onItemClick}
                  className="shrink-0"
                >
                  <div className="relative size-14 sm:size-16 rounded overflow-hidden border border-gray-200 bg-gray-100">
                    <Image
                      src={productImage}
                      alt={productTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              ) : (
                <div className="size-14 sm:size-16 rounded bg-green-50 text-green-700 flex items-center justify-center shrink-0 border border-green-200/50">
                  <Gift className="size-6" />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {productId ? (
                    <Link
                      href={`/shop/${productId}`}
                      onClick={onItemClick}
                      className="text-sm sm:text-base font-semibold text-gray-900 hover:underline truncate"
                    >
                      {productTitle}
                    </Link>
                  ) : (
                    <span className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {productTitle}
                    </span>
                  )}

                  {isAnonymous && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4 font-normal rounded-none"
                    >
                      Anonymous
                    </Badge>
                  )}
                </div>

                {/* Buyer attribution if available */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>From buyer</span>
                  {isAnonymous ? (
                    <span className="inline-flex items-center gap-1 font-medium text-gray-600">
                      <Avatar className="size-4 border border-gray-200 shrink-0">
                        <AvatarFallback className="text-[9px] bg-zinc-100 font-semibold">
                          ?
                        </AvatarFallback>
                      </Avatar>
                      Anonymous Buyer
                    </span>
                  ) : buyer?.userName ? (
                    <Link
                      href={`/member/${buyer.userName}`}
                      onClick={onItemClick}
                      className="inline-flex items-center gap-1 font-medium text-gray-800 hover:underline hover:text-black"
                    >
                      <Avatar className="size-4 border border-gray-200 shrink-0">
                        <AvatarImage
                          src={buyer.picture?.url || defaultImg?.empty_user}
                          alt={buyer.userName}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-[9px] uppercase">
                          {buyer.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      @{buyer.userName}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-600">Buyer</span>
                  )}
                </div>

                {donatedDate && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>
                      {moment(donatedDate).format("MMM DD, YYYY")} (
                      {moment(donatedDate).fromNow()})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Amount */}
            <div className="text-right shrink-0">
              <p className="text-base sm:text-lg font-bold tabular-nums text-green-700">
                ${extraAmount.toFixed(2)}
              </p>
              <span className="text-[11px] text-muted-foreground">
                Extra Donation
              </span>
            </div>
          </div>
        );
      })}
      </div>

      {hasMore && <div ref={triggerRef} className="h-6 w-full" />}

      {loading && (
        <div className="flex justify-center py-6 my-auto">
          <span className="loaderDark !w-8" />
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="py-12 my-auto text-center">
          <Gift
            className="size-10 text-gray-400 mx-auto mb-2"
            strokeWidth={1.5}
          />
          <p className="text-sm font-semibold text-gray-800">
            No extra donations raised yet
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            Additional contributions added by buyers during checkout for this
            charity will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

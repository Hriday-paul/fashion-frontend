"use client";

import React, { useCallback, useRef } from "react";
import Link from "next/link";
import moment from "moment";
import { Calendar, HeartHandshake } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useLazyLoad from "@/hooks/useLazyLoad";
import { useLazyGetMemberDirectDonationsRaisedQuery } from "@/redux/api/donation.api";
import { IDirectDonation } from "@/types";
import { defaultImg } from "@/utils/defaultImg";

interface DirectDonationRaisedListProps {
  userName: string;
  onItemClick: () => void;
}

export default function DirectDonationRaisedList({
  userName,
  onItemClick,
}: DirectDonationRaisedListProps) {
  const [loadData] = useLazyGetMemberDirectDonationsRaisedQuery();
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

  const { data, loading, hasMore } = useLazyLoad<IDirectDonation>({
    triggerRef,
    onGrabData: loadNextPage,
    options: {},
  });

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-2 flex flex-col">
      <div className="divide-y divide-gray-100">
        {data.map((item) => {
          const donor = item?.donor;
          const isAnonymous = Boolean(item?.isAnonymous) || !donor;
          const donorName = isAnonymous
            ? "Anonymous Donor"
            : `${donor?.fname || ""} ${donor?.lname || ""}`.trim() ||
            donor?.userName ||
            "Supporter";
          const donatedDate = item?.donatedAt || item?.createdAt;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-3.5 hover:bg-zinc-50/70 px-2 rounded-none transition-colors"
            >
              {/* Left: Donor Avatar & Info */}
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                {isAnonymous ? (
                  <Avatar className="size-10 sm:size-11 border border-gray-200 shrink-0">
                    <AvatarFallback className="font-semibold text-sm">
                      ?
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Link
                    href={donor?.userName ? `/member/${donor.userName}` : "#"}
                    onClick={onItemClick}
                    className="shrink-0"
                  >
                    <Avatar className="size-10 sm:size-11 border border-gray-200 hover:ring-2 hover:ring-primary/40 transition-all">
                      <AvatarImage
                        src={donor?.picture?.url || defaultImg?.empty_user}
                        alt={donorName}
                        className="object-cover"
                      />
                      <AvatarFallback className="uppercase font-semibold text-sm">
                        {donorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isAnonymous ? (
                      <span className="text-sm sm:text-base font-semibold text-gray-900">
                        Anonymous
                      </span>
                    ) : (
                      <Link
                        href={donor?.userName ? `/member/${donor.userName}` : "#"}
                        onClick={onItemClick}
                        className="text-sm sm:text-base font-semibold text-gray-900 hover:underline truncate"
                      >
                        @{donor?.userName}
                      </Link>
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

                  {item?.message && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 italic">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  )}

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
                  ${Number(item?.amount ?? 0).toFixed(2)}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  Direct Donation
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
          <HeartHandshake
            className="size-10 text-gray-400 mx-auto mb-2"
            strokeWidth={1.5}
          />
          <p className="text-sm font-semibold text-gray-800">
            No direct donations raised yet
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            Direct monetary contributions sent by supporters to this charity
            will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import FormatCurrency from "@/components/shared/FormatCurrency";
import React, { useState } from "react";
import { useGetDirectDonationsRaisedListQuery } from "@/redux/api/donation.api";
import { IDirectDonation } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  HandHeart,
} from "lucide-react";
import Link from "next/link";
import moment from "moment";
import { Pagination } from "react-pagination-bar";
import { defaultImg } from "@/utils/defaultImg";
import EmptyContributionState from "../../donation-contribution/_components/EmptyContributionState";
import ThanksMessageDialog from "./ThanksMessageDialog";

function DirectDonationRaisedTab() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetDirectDonationsRaisedListQuery(
    { page, limit },
    { refetchOnMountOrArgChange: true }
  );

  const list: IDirectDonation[] = Array.isArray(data?.data)
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
        icon={HandHeart}
        title="No direct donations raised yet"
        description="Direct monetary donations sent by supporters to your charity will appear here."
      />
    );
  }

  return (
    <div>
      <div className="divide-y divide-black/10">
        {list.map((don) => {
          const donor = don?.donor;
          const isAnonymous = don?.isAnonymous || !donor;
          const donorName = isAnonymous
            ? "Anonymous Donor"
            : donor?.userName || "Supporter";
          const donatedDate = don?.donatedAt || don?.createdAt;

          return (
            <div
              key={don?.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 hover:bg-zinc-50/60 px-2 rounded-lg transition-colors"
            >
              {/* Left: Donor Avatar + Info */}
              <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                {isAnonymous ? (
                  <Avatar className="size-12 sm:size-14 border border-gray-200 shrink-0">
                    <AvatarFallback className="bg-zinc-100 text-gray-600 font-semibold text-base">
                      ?
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Link
                    href={donor?.userName ? `/member/${donor.userName}` : "#"}
                    className="shrink-0"
                  >
                    <Avatar className="size-12 sm:size-14 border border-gray-200">
                      <AvatarImage
                        src={donor?.picture?.url || defaultImg?.empty_user}
                        alt={donorName}
                        className="object-cover"
                      />
                      <AvatarFallback className="uppercase font-semibold">
                        {donorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                )}

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {isAnonymous ? (
                      <span className="text-base font-semibold text-gray-900">
                        Anonymous Donor
                      </span>
                    ) : (
                      <>
                        <Link
                          href={
                            donor?.userName ? `/member/${donor.userName}` : "#"
                          }
                          className="text-base font-semibold text-gray-900 hover:underline truncate"
                        >
                          {donorName}
                        </Link>
                        
                      </>
                    )}

                    {don?.isAnonymous && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 h-5 font-normal"
                      >
                        Anonymous
                      </Badge>
                    )}
                  </div>

                  {don?.message && (
                    <p className="text-sm text-gray-600 line-clamp-1 italic">
                      &ldquo;{don.message}&rdquo;
                    </p>
                  )}

                  {donatedDate && (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="size-3.5" />
                      <span>
                        Donated {moment(donatedDate).format("MMM DD, YYYY")} (
                        {moment(donatedDate).fromNow()})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Amount + Thank You Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pl-[64px] sm:pl-0">
                <div className="flex flex-col sm:items-end">
                  <p className="text-lg sm:text-xl font-semibold tabular-nums text-green-700">
                    <FormatCurrency fixed amount={Number(don?.amount ?? 0)} decimals={2} />
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Direct Donation
                  </span>
                </div>

                <ThanksMessageDialog
                  referenceId={don?.id}
                  msgType="DIRECT"
                  existingMsg={don?.thanksMsg || don?.thanksMessage}
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

export default DirectDonationRaisedTab;


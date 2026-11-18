"use client";

import FormatCurrency from "@/components/shared/FormatCurrency";
import React from "react";
import { useGetContributionStatsQuery } from "@/redux/api/donation.api";
import { Skeleton } from "@/components/ui/skeleton";
import { HandCoins, HeartHandshake, Package } from "lucide-react";

function formatAmount(value: string | number | undefined): string {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function ContributionStats() {
  const { data: statsRes, isLoading } = useGetContributionStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const sellAmount = Number(statsRes?.data?.totalSellDonationAmount || 0);
  const directAmount = Number(statsRes?.data?.totalDirectDonationAmount || 0);
  const totalAmount = sellAmount + directAmount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mb-8">
      {/* Total Contributed */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Contributed
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-28 rounded-md" />
          ) : (
            <p className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
              <FormatCurrency fixed amount={totalAmount} />
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Combined sell & direct donations
          </p>
        </div>
        <div className="rounded-lg bg-black/5 p-3 text-gray-900">
          <HandCoins className="size-5" />
        </div>
      </div>

      {/* Sell Donation Amount */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sell Donations
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-28 rounded-md" />
          ) : (
            <p className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
              <FormatCurrency fixed amount={sellAmount} />
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Contributed via item purchases/sales
          </p>
        </div>
        <div className="rounded-lg bg-black/5 p-3 text-gray-900">
          <Package className="size-5" />
        </div>
      </div>

      {/* Direct Donation Amount */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Direct Money
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-28 rounded-md" />
          ) : (
            <p className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
              <FormatCurrency fixed amount={directAmount} />
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Contributed directly to charities
          </p>
        </div>
        <div className="rounded-lg bg-black/5 p-3 text-gray-900">
          <HeartHandshake className="size-5" />
        </div>
      </div>
    </div>
  );
}

export default ContributionStats;


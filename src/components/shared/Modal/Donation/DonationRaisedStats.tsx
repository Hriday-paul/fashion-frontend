"use client";

import React from "react";
import { Gift, HeartHandshake, Package } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";
import { useGetCharityRaisedStatsQuery } from "@/redux/api/donation.api";

export type TabType = "sell" | "direct" | "extra";

interface DonationRaisedStatsProps {
  userName: string;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function DonationRaisedStats({
  userName,
  activeTab,
  onTabChange,
}: DonationRaisedStatsProps) {
  const { format } = useCurrency();
  const { data: statsResponse, isLoading } = useGetCharityRaisedStatsQuery(
    userName,
    { skip: !userName }
  );
  const stats = statsResponse?.data;

  const items: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    amount?: number;
  }[] = [
    {
      id: "sell",
      label: "Sell Raised",
      icon: <Package className="size-3.5 sm:size-4" />,
      amount: stats?.sellDonationRaised,
    },
    {
      id: "direct",
      label: "Direct Raised",
      icon: <HeartHandshake className="size-3.5 sm:size-4" />,
      amount: stats?.directDonationraised,
    },
    {
      id: "extra",
      label: "Extra Raised",
      icon: <Gift className="size-3.5 sm:size-4" />,
      amount: stats?.extraDonationRaised,
    },
  ];

  return (
    <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200 bg-zinc-50/70 shrink-0">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "relative px-3 py-3 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-0.5 border-none outline-none focus:outline-none",
              isActive
                ? "bg-white text-gray-950 font-semibold shadow-2xs"
                : "text-gray-600 hover:bg-zinc-100/70 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-gray-800">
              {item.icon}
              <span className="font-medium text-[11px] sm:text-xs truncate">
                {item.label}
              </span>
            </div>

            <span className="text-sm sm:text-base font-bold tabular-nums text-gray-900 mt-0.5">
              {isLoading && item.amount === undefined
                ? "..."
                : format(item.amount ?? 0, { decimals: 1 })}
            </span>

            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
        );
      })}
    </div>
  );
}

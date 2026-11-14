"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrency } from "@/hooks/useCurrency";
import { useGetCharityRaisedStatsQuery } from "@/redux/api/donation.api";
import DonationRaisedStats, { TabType } from "./DonationRaisedStats";
import SellDonationRaisedList from "./SellDonationRaisedList";
import DirectDonationRaisedList from "./DirectDonationRaisedList";
import ExtraDonationRaisedList from "./ExtraDonationRaisedList";

interface DonationsRaisedDialogProps {
  userName: string;
  charityName?: string;
  children: React.ReactNode;
}

export default function DonationsRaisedDialog({
  userName,
  charityName,
  children,
}: DonationsRaisedDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("sell");

  const { data: statsResponse } = useGetCharityRaisedStatsQuery(userName, {
    skip: !open || !userName,
  });
  const stats = statsResponse?.data;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 gap-0 rounded-none overflow-hidden min-h-[520px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-gray-200 shrink-0">
          <div className="pr-12 space-y-1">

            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
              Donations Raised
            </DialogTitle>

            <p className="text-xs sm:text-sm text-gray-600">
              Raised history for {charityName ? `${charityName} ` : ""}
              <span className="font-medium text-gray-900">@{userName}</span>
            </p>
          </div>
        </DialogHeader>

        {open && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Stats as Tab Selector */}
            <DonationRaisedStats
              userName={userName}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Contents */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {activeTab === "sell" && (
                <SellDonationRaisedList
                  userName={userName}
                  onItemClick={() => setOpen(false)}
                />
              )}
              {activeTab === "direct" && (
                <DirectDonationRaisedList
                  userName={userName}
                  onItemClick={() => setOpen(false)}
                />
              )}
              {activeTab === "extra" && (
                <ExtraDonationRaisedList
                  userName={userName}
                  onItemClick={() => setOpen(false)}
                />
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

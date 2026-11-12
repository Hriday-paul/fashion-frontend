"use client";

import React, { useState } from "react";
import { Gift, HeartHandshake, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";
import SellDonationRaisedList from "./SellDonationRaisedList";
import DirectDonationRaisedList from "./DirectDonationRaisedList";
import ExtraDonationRaisedList from "./ExtraDonationRaisedList";

type TabType = "sell" | "direct" | "extra";

interface DonationsRaisedDialogProps {
  userName: string;
  charityName?: string;
  totalRaisedDonation?: number;
  children: React.ReactNode;
}

export default function DonationsRaisedDialog({
  userName,
  charityName,
  totalRaisedDonation,
  children,
}: DonationsRaisedDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("sell");
  const { format } = useCurrency();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: "sell",
      label: "Sell Donation",
      icon: <Package className="size-4" />,
    },
    {
      id: "direct",
      label: "Direct Donation",
      icon: <HeartHandshake className="size-4" />,
    },
    {
      id: "extra",
      label: "Extra",
      icon: <Gift className="size-4" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 gap-0 rounded-none overflow-hidden min-h-[520px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between gap-4 pr-6">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                Donations Raised
              </DialogTitle>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                Raised history for {charityName ? `${charityName} ` : ""}
                <span className="font-medium text-gray-900">@{userName}</span>
              </p>
            </div>

            {totalRaisedDonation !== undefined && (
              <div className="text-right shrink-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground block font-medium">
                  Total Raised
                </span>
                <span className="text-base sm:text-lg font-bold text-green-700 tabular-nums">
                  {format(totalRaisedDonation, { decimals: 1 })}
                </span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Custom Tab Bar */}
        {open && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="px-4 sm:px-5 border-b border-gray-200 bg-zinc-50/50 shrink-0">
              <nav className="flex gap-4 sm:gap-6 justify-start items-center">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "relative pb-2.5 pt-2.5 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer border-none bg-transparent outline-none focus:outline-none focus-visible:outline-none",
                        isActive
                          ? "text-gray-950 font-semibold"
                          : "text-gray-500 hover:text-gray-800"
                      )}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

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

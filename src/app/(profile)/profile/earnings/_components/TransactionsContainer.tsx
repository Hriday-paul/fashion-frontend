"use client";

import React, { useState } from "react";
import moment from "moment";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
} from "lucide-react";
import { Pagination } from "react-pagination-bar";
import { useTransactionsQuery } from "@/redux/api/userApi";
import {
  IWalletTransactions,
  TransactionDirection,
  WalletTransactionType,
} from "@/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const LIMIT = 10;

const FILTER_OPTIONS: { label: string; value: TransactionDirection | "" }[] = [
  { label: "All", value: "" },
  { label: "In", value: TransactionDirection.IN },
  { label: "Out", value: TransactionDirection.OUT },
];

const formatTxTypeFallback = (txType?: WalletTransactionType | string) => {
  if (!txType) return "Transaction";
  return txType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function TransactionsContainer() {
  const [activeFilter, setActiveFilter] = useState<TransactionDirection | "">(
    ""
  );
  const [page, setPage] = useState(1);

  const queryParams: Record<string, any> = {
    page,
    limit: LIMIT,
  };

  if (activeFilter) {
    queryParams.direction = activeFilter;
  }

  const { data, isLoading, isFetching } = useTransactionsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const transactions: IWalletTransactions[] = data?.data?.data || [];
  const meta = data?.data?.meta;

  const handleFilterChange = (value: TransactionDirection | "") => {
    setActiveFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h4 className="text-lg font-semibold text-gray-900">
          Transaction History
        </h4>

        {/* Filter Buttons by Direction */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => handleFilterChange(option.value)}
                className={cn(
                  "px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full border transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary-black text-white border-primary-black"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transactions List */}
      {isLoading || isFetching ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="size-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1 max-w-xs">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 mb-3.5">
            <ReceiptText className="size-6" strokeWidth={1.75} />
          </div>
          <p className="text-base font-semibold text-gray-900">
            No transactions found
          </p>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            {activeFilter === TransactionDirection.IN
              ? "You don't have any incoming transactions yet."
              : activeFilter === TransactionDirection.OUT
              ? "You don't have any outgoing transactions yet."
              : "Your wallet earnings, payouts, and payment activity will appear here."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
          {transactions.map((tx) => {
            const isIn =
              tx?.direction === TransactionDirection.IN ||
              tx?.direction?.toUpperCase() === "IN";

            const formattedAmount = Number(tx?.amount || 0).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            );

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50/70 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full",
                      isIn
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    )}
                  >
                    {isIn ? (
                      <ArrowDownLeft className="size-5" />
                    ) : (
                      <ArrowUpRight className="size-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-medium text-gray-900 break-words">
                      {tx?.description || formatTxTypeFallback(tx?.txType)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {moment(tx?.createdAt).format("MMM D, YYYY • h:mm A")}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      "text-sm sm:text-base font-semibold whitespace-nowrap",
                      isIn ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {isIn ? "+" : "-"}${formattedAmount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.total > LIMIT && (
        <div className="pt-2 text-end">
          <Pagination
            currentPage={page}
            itemsPerPage={LIMIT}
            onPageChange={(pageNumber) => setPage(pageNumber)}
            totalItems={meta.total}
            pageNeighbours={1}
            startLabel={<ChevronFirst className="size-4" />}
            prevLabel={<ChevronLeft className="size-4" />}
            nextLabel={<ChevronRight className="size-4" />}
            endLabel={<ChevronLast className="size-4" />}
            customClassNames={{
              rpbItemClassName:
                "rounded px-2.5 h-7 cursor-pointer border border-gray-200 ml-1.5 text-sm",
              rpbItemClassNameActive: "border-none bg-primary-black text-white",
            }}
          />
        </div>
      )}
    </div>
  );
}

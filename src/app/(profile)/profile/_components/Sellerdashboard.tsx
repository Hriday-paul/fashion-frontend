"use client";

import { useCurrency } from "@/hooks/useCurrency";
import FormatCurrency from "@/components/shared/FormatCurrency";
import React, { useMemo, useState } from "react";
import {
  useGetSellerStatsQuery,
  useGetSellsChartQuery,
} from "@/redux/api/dashboard.api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar, ShoppingBag, Wallet } from "lucide-react";

const DEFAULT_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatAmount(value: string | number | undefined): string {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function Sellerdashboard() {
  const { formatGbp: format } = useCurrency();
  const currentYear = new Date().getFullYear();
  const [sellsYear, setSellsYear] = useState<string>(String(currentYear));

  const yearOptions = useMemo(() => {
    return Array.from({ length: 5 }, (_, idx) => String(currentYear - idx));
  }, [currentYear]);

  const { data: statsRes, isLoading: isStatsLoading } = useGetSellerStatsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: sellsChartRes,
    isLoading: isSellsChartLoading,
    isFetching: isSellsChartFetching,
  } = useGetSellsChartQuery(
    { JoinYear: Number(sellsYear) },
    { refetchOnMountOrArgChange: true }
  );

  const stats = statsRes?.data;

  const sellsChartData = useMemo(() => {
    const raw = sellsChartRes?.data;
    if (!raw || !Array.isArray(raw) || raw.length === 0) {
      return DEFAULT_MONTHS.map((month) => ({
        month,
        shortMonth: month.slice(0, 3),
        totalSellsAmount: 0,
      }));
    }

    return raw.map((item) => ({
      ...item,
      shortMonth: item.month ? item.month.slice(0, 3) : "",
      totalSellsAmount: Number(item.totalSellsAmount || 0),
    }));
  }, [sellsChartRes]);

  return (
    <div className="space-y-6 mt-4 pb-10 min-w-0">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Sales */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Sales
            </p>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-28 rounded-md" />
            ) : (
              <p className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                <FormatCurrency fixed amount={stats?.totalSellsAmount} />
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Revenue from completed orders
            </p>
          </div>
          <div className="rounded-lg bg-black/5 p-3 text-gray-900">
            <ShoppingBag className="size-5" />
          </div>
        </div>

        {/* Available Balance */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Available Balance
            </p>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-28 rounded-md" />
            ) : (
              <p className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                <FormatCurrency fixed amount={stats?.balance} />
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Current account balance
            </p>
          </div>
          <div className="rounded-lg bg-black/5 p-3 text-gray-900">
            <Wallet className="size-5" />
          </div>
        </div>
      </div>

      {/* Sales Overview Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-xs overflow-hidden min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Sales Overview
            </h3>
            <p className="text-sm text-muted-foreground">
              Monthly breakdown of completed order sales
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Calendar className="size-4 text-muted-foreground" />
            <Select value={sellsYear} onValueChange={setSellsYear}>
              <SelectTrigger className="w-[120px] h-9 bg-white border-gray-200">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isSellsChartLoading || isSellsChartFetching ? (
          <div className="h-[340px] w-full flex flex-col justify-end gap-3 p-4">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : (
          <div className="w-full overflow-x-auto pb-2">
            <div className="h-[320px] sm:h-[340px] min-w-[650px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sellsChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="shortMonth"
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) => format(value, { decimals: 0 })}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const dataPoint = payload[0]?.payload;
                      return (
                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md text-xs space-y-1.5">
                          <p className="font-semibold text-gray-900">
                            {dataPoint?.month} {sellsYear}
                          </p>
                          {payload.map((entry, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-4"
                            >
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <span
                                  className="inline-block size-2.5 rounded-xs"
                                  style={{ backgroundColor: entry.color }}
                                />
                                {entry.name}:
                              </span>
                              <span className="font-medium text-gray-900">
                                <FormatCurrency fixed amount={entry.value as number} />
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                  />
                  <Bar
                    dataKey="totalSellsAmount"
                    name="Total Sales"
                    fill="#18181b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sellerdashboard;

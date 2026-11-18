"use client";

import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";

/** Shown only when the preferred currency is not GBP. */
export default function GbpChargeNote({ className }: { className?: string }) {
  const { isGbp } = useCurrency();
  if (isGbp) return null;

  return (
    <p className={cn("text-sm text-gray-600", className)}>
      Charged in GBP. Your bank&apos;s rate and fees may vary.
    </p>
  );
}

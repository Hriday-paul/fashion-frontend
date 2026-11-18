"use client";

import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";

interface ConvertedEstimateProps {
  /** Amount in GBP (what is sent to the API) */
  amount?: number | string | null;
  className?: string;
}

/**
 * Small text showing the approximate value of a GBP amount in the user's
 * preferred currency, e.g. "≈ $12.70 USD (estimate)". Renders nothing when the
 * preferred currency is GBP or the amount is empty/invalid.
 */
export default function ConvertedEstimate({ amount, className }: ConvertedEstimateProps) {
  const { isGbp, code, convert, formatWithCode } = useCurrency();

  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isGbp || num == null || isNaN(num) || num <= 0 || convert(num, code) <= 0) return null;

  return (
    <p className={cn("text-xs text-muted-foreground mt-1", className)}>
      ≈ {formatWithCode(num)} (estimate)
    </p>
  );
}

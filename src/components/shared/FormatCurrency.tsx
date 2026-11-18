"use client";

import { useCurrency } from "@/hooks/useCurrency";

interface FormatCurrencyProps {
  amount?: number | string | null;
  decimals?: number;
  /** Always show GBP (no conversion). Use for orders, earnings, donations, history */
  fixed?: boolean;
  /** Converted amount: prefix "≈" and add a small exact GBP line when the preferred currency is not GBP */
  withGbp?: boolean;
  /** Classes for the small GBP line shown by `withGbp` (default: small muted text) */
  gbpClassName?: string;
  /** With `fixed`: add a small "≈ $12.70 USD" line under the GBP amount when the preferred currency is not GBP */
  estimate?: boolean;
  className?: string;
}

export default function FormatCurrency({
  amount,
  decimals = 2,
  fixed = false,
  withGbp = false,
  gbpClassName = "text-xs font-normal text-muted-foreground",
  estimate = false,
  className,
}: FormatCurrencyProps) {
  const { format, formatGbp, formatWithCode, isGbp } = useCurrency();
  const formatted = fixed ? formatGbp(amount, { decimals }) : format(amount, { decimals });

  const showApprox = !fixed && withGbp && !isGbp;

  const content = (
    <>
      {showApprox && "≈ "}
      {formatted}
      {showApprox && (
        <span className={`block ${gbpClassName}`}>
          {formatGbp(amount, { decimals })} GBP
        </span>
      )}
      {fixed && estimate && !isGbp && (
        <span className="block text-xs font-medium text-gray-600">
          ≈ {formatWithCode(amount, undefined, decimals)}
        </span>
      )}
    </>
  );

  if (className) {
    return <span className={className}>{content}</span>;
  }

  return content;
}

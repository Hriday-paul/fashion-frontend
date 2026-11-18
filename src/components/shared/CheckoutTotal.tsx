"use client";

import { useEffect } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { setCheckoutTotal } from "@/lib/checkoutTotalStore";

/** Checkout total: exact GBP prominent, estimate in the preferred currency and the charge notice. */
export default function CheckoutTotal({ id, total }: { id: string; total: number }) {
  const { isGbp, formatGbp, formatWithCode } = useCurrency();

  useEffect(() => {
    if (Number.isFinite(total)) setCheckoutTotal(id, total);
  }, [id, total]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <p className="text-gray-800 font-semibold text-lg">Total:</p>
        <p className="font-bold text-xl">{formatGbp(total)} GBP</p>
      </div>
      {!isGbp && (
        <>
          <p className="text-right text-sm font-medium text-gray-600">
            Approximately {formatWithCode(total)}
          </p>
          <p className="text-sm leading-snug text-gray-600 pt-2">
            You&apos;ll be charged in GBP. The amount in your selected currency is an estimate. Your bank or payment provider determines the final conversion rate and any applicable fees.
          </p>
        </>
      )}
    </div>
  );
}

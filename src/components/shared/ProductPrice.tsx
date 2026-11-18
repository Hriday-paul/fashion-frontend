"use client";

import { useCurrency } from "@/hooks/useCurrency";

/**
 * Product card price. Preferred currency: "≈ $16.40" (struck-through original before it),
 * with the exact GBP price as small text underneath. In GBP only the £ prices show.
 */
export default function ProductPrice({
  price,
  finalPrice,
}: {
  price?: number | null;
  finalPrice?: number | null;
}) {
  const { format, formatGbp, isGbp } = useCurrency();
  const hasDiscount = price != null && finalPrice != null && price !== finalPrice;
  const approx = isGbp ? "" : "≈ ";

  return (
    <div>
      <div className="flex flex-row gap-x-2 items-center">
        {hasDiscount && (
          <p className="font-medium text-gray-600 line-through text-sm">{format(price)}</p>
        )}
        <p className="font-bold text-primary-black">
          {approx}
          {format(finalPrice ?? price)}
        </p>
      </div>
      {!isGbp && (
        <p className="text-sm text-muted-foreground">{formatGbp(finalPrice ?? price)} GBP</p>
      )}
    </div>
  );
}

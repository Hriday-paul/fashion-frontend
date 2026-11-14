"use client";

import React from "react";
import { useCurrency } from "@/hooks/useCurrency";

interface PriceOverviewProps {
  price?: number | string;
  discountPct?: number | string;
  donationPercent?: number | string;
}

export function PriceOverview({
  price,
  discountPct,
  donationPercent,
}: PriceOverviewProps) {
  const { format } = useCurrency();

  const numericPrice = Math.max(0, parseFloat(String(price)) || 0);
  const numericDiscountPct = Math.min(
    100,
    Math.max(0, parseFloat(String(discountPct)) || 0)
  );
  const numericDonationPct = Math.min(
    100,
    Math.max(0, parseFloat(String(donationPercent)) || 0)
  );

  const discountAmount = (numericPrice * numericDiscountPct) / 100;
  const finalPrice = Math.max(0, numericPrice - discountAmount);
  const donationAmount = (finalPrice * numericDonationPct) / 100;
  const sellerEarnings = Math.max(0, finalPrice - donationAmount);

  if (numericPrice <= 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 pt-1 text-sm md:text-base">
      <p className="text-gray-900">
        Final Price:{" "}
        <span className="font-semibold text-green-700">
          ${finalPrice.toFixed(2)}
        </span>
      </p>
      {numericDonationPct > 0 && (
        <p className="text-gray-900">
          Donation Amount:{" "}
          <span className="font-semibold text-red-500">
            ${donationAmount.toFixed(2)}
            {` (${numericDonationPct}%)`}
          </span>
        </p>
      )}
      <p className="text-gray-900">
        Seller Earning:{" "}
        <span className="font-bold text-green-700">
          ${sellerEarnings.toFixed(2)}
        </span>
      </p>
    </div>
  );
}

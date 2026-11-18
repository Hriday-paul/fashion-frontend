"use client";

import FormatCurrency from "@/components/shared/FormatCurrency";
import React from "react";
import { IOrder } from "@/types";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BuyerPriceOverviewProps {
  order: IOrder;
}

export function BuyerPriceOverview({ order }: BuyerPriceOverviewProps) {
  const itemsTotal = order?.itemsTotal || 0;
  const bundleDiscountPercent = order?.bundleDiscountPercent || 0;
  const bundleDiscountAmount = bundleDiscountPercent > 0 ? (itemsTotal * bundleDiscountPercent) / 100 : 0;

  return (
    <div className="border border-neutral-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-neutral-800" />
          <h3 className="text-sm font-bold text-neutral-900">Price Overview</h3>
        </div>
        {order?.payment?.status && (
          <Badge variant="outline" className="text-[10px] font-medium border-neutral-300 text-neutral-800 rounded-none">
            {order.payment.status}
          </Badge>
        )}
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-neutral-600">
          <span>Items Subtotal</span>
          <span className="font-medium text-neutral-900"><FormatCurrency fixed amount={itemsTotal} decimals={2} /></span>
        </div>

        {bundleDiscountPercent > 0 && (
          <div className="flex justify-between text-neutral-600">
            <span className="flex items-center gap-1">
              Bundle Discount
              <span className="bg-neutral-100 text-neutral-900 font-semibold px-1 py-0.2 rounded text-[10px]">
                {bundleDiscountPercent}% OFF
              </span>
            </span>
            <span className="font-medium text-neutral-900">-<FormatCurrency fixed amount={bundleDiscountAmount} decimals={2} /></span>
          </div>
        )}

        {order?.extraDonation > 0 && (
          <div className="flex justify-between text-neutral-600">
            <span>Extra Donation</span>
            <span className="font-medium text-neutral-900"><FormatCurrency fixed amount={order.extraDonation} decimals={2} /></span>
          </div>
        )}

        {order?.serviceFee > 0 && (
          <div className="flex justify-between text-neutral-600">
            <span>Service Fee</span>
            <span className="font-medium text-neutral-900"><FormatCurrency fixed amount={order.serviceFee} decimals={2} /></span>
          </div>
        )}

        {order?.allowedAuthentication && order?.authenticationFee > 0 && (
          <div className="flex justify-between text-neutral-600">
            <span>Authentication Fee</span>
            <span className="font-medium text-neutral-900"><FormatCurrency fixed amount={order.authenticationFee} decimals={2} /></span>
          </div>
        )}

        {order?.treeCredit > 0 && (
          <div className="flex justify-between text-neutral-600">
            <span>Tree Planting Gift</span>
            <span className="font-medium text-neutral-900"><FormatCurrency fixed amount={order.treeCredit} decimals={2} /></span>
          </div>
        )}

        <div className="flex justify-between text-neutral-600">
          <span>Delivery Charge</span>
          <span className="font-medium text-neutral-900">
            {order?.totalDelivery > 0 ? <FormatCurrency fixed amount={order.totalDelivery} /> : "Free"}
          </span>
        </div>

        <div className="border-t border-neutral-100 pt-3 flex justify-between items-baseline">
          <span className="text-sm font-bold text-neutral-900">Total Paid</span>
          <span className="text-base font-bold text-neutral-900">
            <FormatCurrency fixed amount={(order?.totalPrice || 0)} decimals={2} />
          </span>
        </div>
      </div>
    </div>
  );
}

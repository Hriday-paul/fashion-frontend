"use client";

import FormatCurrency from "@/components/shared/FormatCurrency";
import React from "react";
import { formatSize } from "@/lib/formatSize";
import Image from "next/image";
import Link from "next/link";
import { IOrderItem } from "@/types";
import { defaultImg } from "@/utils/defaultImg";
import { Package } from "lucide-react";

interface OrderItemsListProps {
  items: IOrderItem[];
}

export function OrderItemsList({ items = [] }: OrderItemsListProps) {
  return (
    <div className="border border-neutral-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-neutral-800" />
          <h3 className="text-sm font-bold text-neutral-900">Ordered Items</h3>
        </div>
        <span className="text-xs text-neutral-500 font-medium">
          {items.length} {items.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="divide-y divide-neutral-100">
        {items.map((item) => {
          const product = item?.product;
          const imageUrl = product?.images?.[0]?.url || defaultImg.product;
          const itemPrice = item?.unitPrice ?? (product?.finalPrice || 0);

          return (
            <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
              <div className="relative size-16 shrink-0 border border-neutral-200 overflow-hidden bg-neutral-50">
                <Image
                  src={imageUrl}
                  alt={product?.title || "Product Image"}
                  fill
                  sizes="64px"
                  placeholder="blur"
                  blurDataURL={defaultImg.placeholderImg}
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                {product?.id ? (
                  <Link
                    href={`/shop/${product.id}`}
                    className="text-xs font-semibold text-neutral-900 hover:underline line-clamp-1 block"
                  >
                    {product?.title || "Product"}
                  </Link>
                ) : (
                  <p className="text-xs font-semibold text-neutral-900 line-clamp-1">
                    {product?.title || "Product"}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                  {product?.category?.name && <span>{product.category.name}</span>}
                  {product?.size?.title && <span>· Size: {formatSize(product.size, product?.SizeFormat)}</span>}
                  {product?.condition && <span>· {product.condition}</span>}
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[11px] text-neutral-500">Qty: {item.quantity || 1}</span>
                  <span className="text-xs font-bold text-neutral-900"><FormatCurrency fixed amount={itemPrice} decimals={2} /></span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

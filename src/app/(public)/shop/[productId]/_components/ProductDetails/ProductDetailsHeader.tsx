import { IProduct } from "@/types";
import React from "react";
import ProductStats from "./ProductStats";
import FormatCurrency from "@/components/shared/FormatCurrency";
import GbpChargeNote from "@/components/shared/GbpChargeNote";

export default function ProductDetailsHeader({ product, isMyProduct }: { product: IProduct; isMyProduct: boolean }) {

  return (
    <div className="xl:space-y-1 space-y-0.5">

      <ProductStats product={product} isMyProduct={isMyProduct}></ProductStats>

      <h2 className="md:text-xl text-lg text-[#262626] font-semibold tracking-wide">
        {product?.title}
      </h2>

      <div className="flex space-y-1.5 justify-between flex-col md:justify-start ">

        <h4 className="md:text-2xl text-xl font-semibold">{<FormatCurrency withGbp gbpClassName="text-sm font-medium text-gray-800" amount={product?.finalPrice} />}</h4>

        {product?.discountPct > 0 && (
          <div className="flex gap-x-3 items-center">
            <p className="line-through text-primary-gray text-base">
              {<FormatCurrency amount={product?.price} />}
            </p>
            <div className="bg-primary-red text-primary-white px-2 py-0.5 text-sm">
              -{Math.ceil(product?.discountPct)}%
            </div>
          </div>
        )}

        <GbpChargeNote />

      </div>
    </div>
  );
}

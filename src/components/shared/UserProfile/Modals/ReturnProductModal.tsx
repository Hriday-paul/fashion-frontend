"use client";

import FormatCurrency from "@/components/shared/FormatCurrency";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const returnRequest = {
  itemNumber: "#A007",
  productTitle: "Teen Tops & Pant",
  buyerName: "Arish Islam",
  date: "Feb 10, 2025",
  productPrice: 225.0,
  status: "Request for return",
  reason: "Wrong Size",
  images: [
    "/offer_page_product1.png",
    "/offer_page_product2.png",
    "/offer_page_product3.png",
    "/offer_page_product2.png",
    "/offer_page_product2.png",
  ],
};

export function ReturnProductModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle className="sr-only">Return Request Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Images */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <Image
                width={220}
                height={220}
                src={returnRequest.images[0] || "/placeholder.svg"}
                alt={`Product ${returnRequest.itemNumber}`}
                className="w-full h-auto rounded-md object-cover"
              />
            </div>
            <div className="w-1/2 grid grid-cols-2 gap-2">
              {returnRequest.images.slice(0, 4).map((image, index) => (
                <Image
                  width={110}
                  height={110}
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Product ${returnRequest.itemNumber} image ${index + 1}`}
                  className="w-full h-auto rounded-md object-cover"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Item Number</p>
                <p className="font-medium">{returnRequest.itemNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Product Title</p>
                <p className="font-medium">{returnRequest.productTitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Buyer Name</p>
                <p className="font-medium">{returnRequest.buyerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{returnRequest.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Product Price</p>
                <p className="font-medium">
                  <FormatCurrency fixed amount={returnRequest.productPrice} decimals={1} />
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800"
                >
                  {returnRequest.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Reason</p>
              <p className="font-medium">{returnRequest.reason}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              size={"sm"}
              className="bg-black text-white hover:bg-gray-800 "
            >
              APPROVE
            </Button>
            <Button size={"sm"} variant="outline" className="border-gray-300">
              REJECT
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

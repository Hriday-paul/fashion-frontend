"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AddNewOffer } from "@/lib/Actions/Product.api";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types";
import { defaultImg } from "@/utils/defaultImg";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";

export default function SendOfferModal({
  open,
  setOpen,
  products,
  sellerId
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  products: IProduct[];
  sellerId: string;
}) {
  const { format } = useCurrency();

  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [isCustomOffer, setIsCustomOffer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [expanded, setIsExpanded] = useState<boolean>(false);

  const handleSendOffer = async () => {
    setIsLoading(true);
    try {
      const payload = {
        sellerId,
        offerPrice: offerPrice,
        productIds: products?.map((product) => product?.id),
      };

      const res = await AddNewOffer({ payload });
      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success(res.message || "Offer sent successfully!");

      setError(null);
      setOpen(false);

    } catch (err: any) {
      setError(err?.message || "Offer sending failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = products?.reduce((acc, product) => acc + product?.finalPrice, 0);

  const offerData = [
    {
      id: 1,
      discount: 5,
      price: totalPrice - (totalPrice * 5) / 100,
    },
    {
      id: 2,
      discount: 10,
      price: totalPrice - (totalPrice * 10) / 100,
    },
    {
      id: 3,
      discount: 15,
      price: totalPrice - (totalPrice * 15) / 100,
    },
  ];

  const images = products?.map((product) => product?.images?.[0]).filter(Boolean);
  const visibleImages = images?.slice(0, 3);
  const remainingCount = images.length - visibleImages.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="w-[700px] rounded-none overflow-y-auto max-h-screen">

        <DialogHeader className="border-b border-gray-200 pb-3.5">
          <h2 className="text-base font-medium text-center">Send Offer</h2>
        </DialogHeader>

        <div className="space-y-4">

          <div className="border-b border-gray-200 pb-4">
            <div className="space-y-2">
              {(expanded ? products : products.slice(0, 3)).map((product, index) => <div key={product?.id} className="flex flex-row  gap-x-4">
                <div className="relative">
                  <Image
                    src={product?.images[0]?.url || defaultImg?.product}
                    alt="hero image"
                    width={500}
                    height={500}
                    placeholder="blur"
                    blurDataURL={defaultImg?.placeholderImg}
                    className="size-20 rounded object-cover"
                  />
                </div>

                <div className="">
                  <p className="text-base line-clamp-1">
                    {product?.title}
                  </p>
                  <p className="text-gray-700 ">{product?.size?.title}</p>
                  <p className="text-gray-700">Price: <span className="font-semibold text-primary-black">{format(product?.finalPrice)}</span></p>

                  {/* <p className="text-[#E12728]">Offer Expire in 24 hrs</p> */}
                </div>
              </div>)}
            </div>

            {products.length > 3 && <Button variant="ghost" className="more-products" aria-expanded={expanded} aria-controls="bundle-products" onClick={() => setIsExpanded(!expanded)}>
              {expanded ? <>Show less <ChevronUp /></> : <>+{products.length - 3} more products <ChevronDown /></>}
            </Button>}

          </div>

          <div className="flex flex-row items-center justify-between gap-x-2">
            <span>
              Total price <span className="text-muted-foreground">({products.length} products)</span>
            </span>
            <strong>{format(totalPrice)}</strong></div>

          <div className="">

            <div className={cn("grid grid-cols-2 lg:grid-cols-4 items-center gap-3 flex-wrap")}>
              {offerData?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => {
                    setIsCustomOffer(false);
                    setOfferPrice(item?.price);
                  }}
                  className={cn("text-center py-2 px-5 rounded border border-gray-200 cursor-pointer shadow-sm text-sm h-full font-medium text-gray-700", offerPrice === item?.price && " bg-black text-zinc-50")}
                >
                  <span className="font-semibold ">{format(item?.price)}</span> for <br /> {item?.discount}% off
                </button>
              ))}
              <button
                onClick={() => {
                  setIsCustomOffer(true);
                  setOfferPrice(0);
                }}
                className={cn("text-center py-2 px-5 rounded border border-gray-200 cursor-pointer h-full shadow flex flex-col items-center justify-center tex-sm", isCustomOffer && " border-black bg-zinc-50")}
              >
                <Plus />
                Custom
              </button>
            </div>

            {isCustomOffer && <div className="py-5">
              <p className="text-sm font-medium text-black mb-2">Custom Offer</p>
              <Input
                placeholder="Enter your offer price"
                value={offerPrice}
                onChange={(e) => setOfferPrice(parseFloat(e.target.value) || 0)}
                className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-5 px-3"
              />
              {/* <div className="flex mt-2 items-center gap-x-0.5">
                <InfoIcon3 />
                <p className="text-[#E12728] line-clamp-1 text-base">
                  The lowest amount you can offer is £210.00 for (20% off).
                </p>
              </div> */}
            </div>}

          </div>

          {error && (
            <div className="rounded border border-red-300 bg-red-50 px-3 py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ------------------------------- action buttons ------------------------------- */}
          <div className="mt-5 flex gap-2">
            <Button disabled={offerPrice === 0 || isLoading} onClick={handleSendOffer} className="w-full h-11 rounded-none cursor-pointer">
              {isLoading ? <span className="loader" /> : "Send Offer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

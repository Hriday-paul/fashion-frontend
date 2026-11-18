import FormatCurrency from "@/components/shared/FormatCurrency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IProduct } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { defaultImg } from "@/utils/defaultImg";
import Link from "next/link";
import SendOfferModal from "@/components/shared/Modal/SendOfferModal";

export default function ReviewBundleModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    items: { product: IProduct, id: string }[]
    subTotal: number,
    total: number,
    bundleDiscountPercent: number,
    bundleDiscountAmount: number,
    cartGroupId: string | null,
    sellerId : string
  }
}) {

  const router = useRouter();
  const [openOfferModal, setOpenOfferModal] = useState(false);

  const handleBuyNow = () => {
    router.push("/shopping-cart/shopping");
  };

  const handleSendOffer = () => {
    setOpenOfferModal(true);
    setOpen(false);
  }

  const haveAnyStockoutItems = data?.items?.some(item => item?.product?.stock < 1);

  const products = data?.items?.map(item => item?.product);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none overflow-y-auto max-h-screen">
          <DialogHeader>
            <DialogTitle className="border-b pb-4 text-base">
              Review Bundle
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">


            <div>
              <h3 className=" text-primary-gray mb-1">
                {data?.items?.length} Items
              </h3>
              <div className="flex items-center gap-x-2">
                <div className="flex flex-wrap gap-2">
                  {data?.items?.map((item, index) => (
                    <div key={item?.id} className="relative">
                      <Image
                        src={item?.product?.images?.[0]?.url || defaultImg?.product}
                        alt="product"
                        width={1200}
                        height={1200}
                        className="rounded h-20 w-20 object-cover"
                      />
                      {item?.product?.stock < 1 && <div className="h-full w-full flex justify-center items-center absolute bottom-0 left-0">
                        <span className=" text-white text-[8px] py-0.5 w-full flex items-center justify-center bg-destructive">
                          STOCK OUT
                        </span>
                      </div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <hr />

            {/* ----------------------------- all features ---------------------- */}
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap justify-between text-muted-foreground">
                <p>Subtotal</p>
                <p><FormatCurrency withGbp amount={data?.subTotal} decimals={2} /></p>
              </div>
              <div className="flex gap-2 flex-wrap justify-between text-[#059669]">
                <p>Bundle discount ({data?.bundleDiscountPercent}%)</p>
                <p>-<FormatCurrency withGbp amount={data?.bundleDiscountAmount} decimals={2} /></p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">
                  Shipping calculated at checkout
                </p>
              </div>

              <hr />
              <div className="flex gap-2 flex-wrap justify-between text-lg font-semibold">
                <h4>Total to pay</h4>
                <h4> <FormatCurrency withGbp amount={data?.total} decimals={2} />
                </h4>
              </div>

            </div>

            {haveAnyStockoutItems && (
              <p className="text-sm text-destructive">
                Some items in your bundle are out of stock. Remove them to proceed with checkout or send an offer to the seller.
              </p>
            )}

            <div className="mt-5 flex gap-2">
              <div className="flex-1">
                <Link href={data?.cartGroupId ? `/checkout/cart/${data?.cartGroupId}` : "/shopping-cart"}>
                  <Button
                    onClick={handleBuyNow}
                    className="w-full rounded-none border-primary-black cursor-pointer !h-11"
                    variant={"outline"}
                    disabled={haveAnyStockoutItems}
                  >
                    BUY NOW
                  </Button>
                </Link>
              </div>
              <Button onClick={handleSendOffer} className="flex-1 rounded-none cursor-pointer !h-11" disabled={haveAnyStockoutItems}>
                Make an Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SendOfferModal open={openOfferModal} setOpen={setOpenOfferModal} products={products} sellerId={data?.sellerId} />

    </>
  );
}

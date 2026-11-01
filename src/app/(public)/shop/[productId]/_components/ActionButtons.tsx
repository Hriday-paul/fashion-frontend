"use client";
import { MessageIcon, OfferIcon, OfferIcon2 } from "@/icons";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import SendOfferModal from "@/components/shared/Modal/SendOfferModal";
import { CharityDonationSelectDialog } from "@/components/shared/Modal/Charity/CharityDonationSelectDialog";
import { IProductWithUser } from "./ProductDetails/ProductDetails";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddToCart } from "@/lib/Actions/Cart.action";
import { useDispatch } from "react-redux";
import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Link from "next/link";
import { CreateChat } from "@/lib/Actions/Product.api";
import { toast } from "sonner";

export type TPayload = {
  productId: string;
  quantity: number;
  extraDonation: number;
  extraDonationAnonymous: boolean;
  charities: {
    charityId: string;
  }[];
};

const ActionButtons = ({ product }: { product: IProductWithUser }) => {
  const router = useRouter();
  const [showOpenOfferModal, setShowOpenOfferModal] = useState<boolean>(false);
  const [showOpenOpenCharityModal, setShowOpenOpenCharityModal] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const [isPending, startTransition] = useTransition();

  const [buyMode, setBuyMode] = useState<"cart" | "buy">("cart");

  const isInCart = product?.cartItems?.length > 0 || false;

  const handleCharitySelectByCart = async () => {

    //if seller allowed donation then open charity modal otherwise add to cart directly
    if (product?.donation_percent > 0 && product?.charities?.length > 0) {
      setBuyMode("cart");
      setShowOpenOpenCharityModal(true);
    } else {
      const payload: TPayload = {
        productId: product?.id,
        quantity: 1,
        extraDonation: 0,
        extraDonationAnonymous: false,
        charities: [],
      };
      await onSubmit(payload);
    }
  };

  const onSubmit = async (payload: TPayload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await AddToCart({ payload, extraRevalidatePaths: [`/shop/${product?.id}`] });
      if (!res.success) {
        throw new Error(res.message);
      }
      dispatch(baseApi.util.invalidateTags([tagTypes.cart])); // Invalidate cart tag to refresh cart state
      setShowOpenOpenCharityModal(false);
    } catch (error: any) {
      if (isRedirectError(error)) {
        throw error; // Let Next.js handle the redirect
      }
      setError(error?.message || "An error occurred while adding to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lg:space-y-8 space-y-4">
        {/* <h6 className="uppercase text-primary-gray underline">Quantity</h6> */}
        {/* =============== action buttons ================ */}
        <div className="lg:space-y-3 space-y-2 max-w-lg md:gap-x-3 gap-x-2 2xl:w-2/3">

          {/* =============== buy now  button ================ */}
          {product?.allow_offer && <Button
            onClick={() => setShowOpenOfferModal(true)}
            className="w-full rounded-none py-6 font-medium col-span-2 cursor-pointer"
            variant={"default"}
          >
            Make an offer <OfferIcon2 className="size-5 text-white"></OfferIcon2>
          </Button>}

          <div className="flex flex-row gap-x-3 items-center">
            {isInCart ? <div className="flex flex-row gap-x-2 items-center justify-center py-1.5">
              <Check />
              <p className="text-lg font-medium">Added to Cart</p>
            </div> : <Button onClick={handleCharitySelectByCart} className="py-5 border-2 border-primary-black rounded-none font-semibold cursor-pointer flex-1" variant={"outline"} disabled={isInCart}>ADD TO CART</Button>}

            <Button onClick={() => {
              startTransition(() => {
                router.push(`/checkout/listing/${product?.id}`)
              });
            }} className="py-5 border-2 border-primary-black rounded-none font-semibold cursor-pointer flex-1" variant={"outline"}>{isPending ? <div className="w-5 aspect-square rounded-full border-[2px] border-primary-black border-r-gray-500 animate-spin"></div> : "BUY NOW"}</Button>

          </div>

        </div>
      </div>
      <SendOfferModal
        open={showOpenOfferModal}
        setOpen={setShowOpenOfferModal}
        products={[product]}
        sellerId={product?.userId}
      />
      <CharityDonationSelectDialog
        product={product}
        open={showOpenOpenCharityModal}
        onOpenChange={setShowOpenOpenCharityModal}
        purchasePrice={product?.finalPrice}
        donationPercentage={product?.donation_percent}
        charities={product?.charities}
        buyMode={buyMode}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default ActionButtons;

export const SMActionButtons = ({ product, isSold, isDeleted }: { product: IProductWithUser; isSold: boolean; isDeleted: boolean }) => {
  const router = useRouter();
  const [showOpenOfferModal, setShowOpenOfferModal] = useState<boolean>(false);
  const [showOpenOpenCharityModal, setShowOpenOpenCharityModal] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();
  const [isChatTransition, startChatTransition] = useTransition();

  const [chatloading, setChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const [buyMode, setBuyMode] = useState<"cart" | "buy">("cart");

  const isInCart = product?.cartItems?.length > 0 || false;

  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    const prodId = product?.id;
    const sellerId = product?.user?.id;
    setChatLoading(true);
    try {
      const res = await CreateChat({
        payload: {
          products: [prodId],
          user2Id: sellerId,
        },
      });

      if (!res.success || !res?.data?.id) {
        throw new Error(res.message || "Failed to start chat");
      }

      startChatTransition(() => {
        router.push(`/inbox/${res.data!.id}`);
      });
    } catch (error: any) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast.error(error?.message || "Failed to start chat");
    } finally {
      setChatLoading(false);
    }
  };

  const handleCharitySelectByCart = async () => {

    //if seller allowed donation then open charity modal otherwise add to cart directly
    if (product?.donation_percent > 0 && product?.charities?.length > 0) {
      setBuyMode("cart");
      setShowOpenOpenCharityModal(true);
    } else {
      const payload: TPayload = {
        productId: product?.id,
        quantity: 1,
        extraDonation: 0,
        extraDonationAnonymous: false,
        charities: [],
      };
      await onSubmit(payload);
    }
  };

  const onSubmit = async (payload: TPayload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await AddToCart({ payload, extraRevalidatePaths: [`/shop/${product?.id}`] });
      if (!res.success) {
        throw new Error(res.message);
      }
      dispatch(baseApi.util.invalidateTags([tagTypes.cart])); // Invalidate cart tag to refresh cart state
      setShowOpenOpenCharityModal(false);
    } catch (error: any) {
      if (isRedirectError(error)) {
        throw error; // Let Next.js handle the redirect
      }
      setError(error?.message || "An error occurred while adding to cart.");
    } finally {
      setLoading(false);
    }
  };

  const isChatSubmitting = chatloading || isChatTransition;

  return (
    <>
      <div className="max-w-6xl mx-auto flex items-center gap-3">

        {isChatSubmitting ? <div className="w-5 aspect-square rounded-full border-[2px] border-primary-black border-r-gray-400 animate-spin"></div> : <button onClick={handleContact}> <MessageIcon className="size-10" /></button>}

        {isSold ? <div className="py-2.5 bg-yellow-700 px-5 flex-1">
          <p className="text-center text-white">Item Sold Out</p>
        </div> : isDeleted ? <div className="py-2.5 bg-yellow-700 px-5 flex-1">
          <p className="text-center text-white">Item not available</p>
        </div> : <div className="flex-1 flex flex-row justify-between items-center gap-3">

          {product?.allow_offer ? <Button
            onClick={() => setShowOpenOfferModal(true)}
            className="py-5 border-2 border-primary-black rounded-none font-semibold cursor-pointer" variant={"outline"}>Make an offer <OfferIcon className="size-5"></OfferIcon></Button> : isInCart ? <div className="flex flex-row gap-x-2 items-center justify-center py-1.5 flex-1">
              <Check />
              <p className="text-lg font-medium">Added to Cart</p>
            </div> : <Button variant="outline" onClick={handleCharitySelectByCart} className="py-5 border-2 border-primary-black rounded-none font-semibold cursor-pointer flex-1">Add to Cart</Button>}

          <div className="flex flex-row gap-x-2 items-center justify-center flex-1">

            <Button onClick={() => {
              startTransition(() => {
                router.push(`/checkout/listing/${product?.id}`)
              })
            }} className="py-5 border-2 border-primary-black rounded-none font-medium cursor-pointer flex-1">
              {isPending ? <div className="w-5 aspect-square rounded-full border-[2px] border-white border-r-gray-600 animate-spin"></div> : "Buy Now"}
            </Button>

          </div>

        </div>
        }

      </div>

      <SendOfferModal
        open={showOpenOfferModal}
        setOpen={setShowOpenOfferModal}
        products={[product]}
        sellerId={product?.userId}
      />
      <CharityDonationSelectDialog
        product={product}
        open={showOpenOpenCharityModal}
        onOpenChange={setShowOpenOpenCharityModal}
        purchasePrice={product?.finalPrice}
        donationPercentage={product?.donation_percent}
        charities={product?.charities}
        buyMode={buyMode}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
    </>
  );
};

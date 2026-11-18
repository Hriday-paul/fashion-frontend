"use client";
import GbpInput from "@/components/shared/GbpInput";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Gift, Heart, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICharity, IProduct } from "@/types";
import { useCurrency } from "@/hooks/useCurrency";
import { TPayload } from "@/app/(public)/shop/[productId]/_components/ActionButtons";
import { defaultImg } from "@/utils/defaultImg";
import { userRoleMapper } from "@/utils/userRoleMapper";
import { cn } from "@/lib/utils";

interface CharityDonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchasePrice: number;
  donationPercentage: number;
  product: IProduct;
  charities: ICharity[];
  buyMode: "cart" | "buy";
  onSubmit: (payload: TPayload) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PRESET_AMOUNTS = [0, 1, 2, 5];

export function CharityDonationSelectDialog({
  open,
  onOpenChange,
  purchasePrice,
  donationPercentage,
  product,
  charities,
  buyMode,
  onSubmit: onSubmitHandler,
  error,
  loading,
}: CharityDonationDialogProps) {
  const { formatGbp: format } = useCurrency();

  // number = a preset, "other" = custom input visible
  const [selectedPreset, setSelectedPreset] = useState<number | "other">(0);
  const [additionalDonation, setAdditionalDonation] = useState<number>(0);
  const [extraDonationAnonymous, setExtraDonationAnonymous] = useState(false);

  const totalDonation = (purchasePrice * donationPercentage) / 100;
  const finalTotal = totalDonation + additionalDonation;

  // Everything is split equally between all of the seller's charities
  const perCharityAmount =
    charities.length > 0 ? finalTotal / charities.length : 0;

  const handlePreset = (amount: number) => {
    setSelectedPreset(amount);
    setAdditionalDonation(amount);
    if (amount === 0) setExtraDonationAnonymous(false);
  };

  const handleOther = () => {
    setSelectedPreset("other");
    setAdditionalDonation(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      productId: product?.id,
      quantity: 1,
      extraDonation: additionalDonation,
      extraDonationAnonymous:
        additionalDonation > 0 ? extraDonationAnonymous : false,
    };

    await onSubmitHandler(payload as TPayload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-y-auto max-h-[95vh] rounded-none">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            Your Purchase Makes a Difference
            <Heart className="size-6 fill-green-700 text-green-700" />
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">
          {/* Purchase Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-black text-white rounded-full px-4 py-2.5 text-center text-sm font-medium">
              Purchase Price: {format(purchasePrice)}
            </div>
            <div className="bg-black text-white rounded-full px-4 py-2.5 text-center text-sm font-medium">
              Total Donation ({donationPercentage}%): {format(totalDonation)}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500">
            By purchasing this item, you&apos;re helping support these
            charities. The seller has pledged {donationPercentage}% of the sale
            to charity, and your purchase makes this contribution possible.
          </p>

          {/* Charity cards */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {charities.map((item) => {
              const charity = item.charity;
              const displayName =
                charity?.userName ||
                `${charity?.fname ?? ""} ${charity?.lname ?? ""}`.trim();

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 sm:gap-4 rounded border border-gray-200 bg-white px-2 py-1.5"
                >
                  <Image
                    src={charity?.charityThumbnail?.url || "/not-found.png"}
                    alt={displayName}
                    width={800}
                    height={600}
                    placeholder="blur"
                    blurDataURL={defaultImg?.placeholderImg}
                    className="object-cover w-24 h-14 rounded"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {userRoleMapper(charity?.auth?.role)?.label}
                    </p>
                    {charity?.bio && (
                      <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">
                        {charity?.bio}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-base font-semibold text-gray-900">
                      {format(perCharityAmount)}
                    </p>
                    <Link
                      href={`/member/${charity?.userName}`}
                      onClick={() => onOpenChange(false)}
                      className="mt-1 inline-flex items-center underline text-sm text-gray-700 hover:text-black"
                    >
                      View Charity
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {charities.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No charities available for this product.
              </p>
            )}
          </div>

          <div className="border-t border-gray-200" />

          {/* Extra donation */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-base font-semibold text-gray-900">
                Would you like to add an extra donation? (Optional)
              </Label>
              <Info
                className="size-4 text-gray-400"
                aria-label="More information"
              />
            </div>
            <p className="text-sm text-gray-500">
              Any additional donation will be shared equally between the
              selected charities.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedPreset === amount ? "default" : "outline"}
                  onClick={() => handlePreset(amount)}
                  className="cursor-pointer rounded-md shadow-none font-medium"
                >
                  £{amount}
                </Button>
              ))}
              <Button
                type="button"
                variant={selectedPreset === "other" ? "default" : "outline"}
                onClick={handleOther}
                className="cursor-pointer rounded-md shadow-none font-medium"
              >
                Other
              </Button>
            </div>

            {selectedPreset === "other" && (
              <div className="mt-2">
                <GbpInput
                  step="0.01"
                  placeholder="Enter your amount in GBP"
                  autoFocus
                  value={additionalDonation || ""}
                  onChange={(e) =>
                    setAdditionalDonation(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            )}
          </div>

          {/* Anonymous option: only once an extra amount is set */}
          {additionalDonation > 0 && (
            <div className="flex items-center space-x-3">
              <Checkbox
                id="extraDonationAnonymous"
                checked={extraDonationAnonymous}
                onCheckedChange={(checked) =>
                  setExtraDonationAnonymous(checked === true)
                }
                className="data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <Label
                htmlFor="extraDonationAnonymous"
                className="text-sm font-normal cursor-pointer"
              >
                Make my additional donation anonymous
              </Label>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3">
            <Gift className="size-6 shrink-0 text-green-800" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Total Donation to Charities: {format(finalTotal)}
              </p>
              <p className="text-xs text-gray-500">
                ({format(totalDonation)} from seller +{" "}
                {format(additionalDonation)} extra donation)
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            variant="default"
            className={cn(
              "w-full py-6 font-medium rounded-none cursor-pointer text-base"
            )}
          >
            {loading ? (
              <span className="loader" />
            ) : buyMode === "cart" ? (
              "Continue to Cart"
            ) : (
              "Continue to Checkout"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
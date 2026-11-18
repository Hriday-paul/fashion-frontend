"use client";
import ConvertedEstimate from "@/components/shared/ConvertedEstimate";
import FormatCurrency from "@/components/shared/FormatCurrency";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, RotateCcw, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addTreeCountToCart } from "@/redux/features/cart.slice";

const PRESET_AMOUNTS = [1, 5, 20, 50];
const PRICE_PER_TREE = 4;
const DEFAULT_PRESET = 5;

export default function DonationCard({ cartGroupId }: { cartGroupId: string }) {
  const dispatch = useDispatch();
  const selectedcart = useSelector((state: RootState) =>
    state.cart?.carts?.find((cart) => cart?.cartGroupId === cartGroupId)
  );

  const defaultTreeCount = selectedcart?.treeCount || 0;
  const defaultTreeCostTotal = selectedcart?.treeCostTotal || 0;
  const isGifted = defaultTreeCostTotal > 0;
  const isPreset = PRESET_AMOUNTS.includes(defaultTreeCount);

  const [selectedAmount, setSelectedAmount] = useState(DEFAULT_PRESET);
  const [customAmount, setCustomAmount] = useState("");

  // Derived, not stored: custom mode is simply "there's text in the custom field"
  const isCustomSelected = customAmount !== "";
  const parsedCustom = parseInt(customAmount, 10);
  const treeCount = isCustomSelected
    ? (Number.isNaN(parsedCustom) ? 0 : parsedCustom)
    : selectedAmount;
  const totalPrice = treeCount * PRICE_PER_TREE;

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    if (value === "") setSelectedAmount(DEFAULT_PRESET);
  };

  const handleReset = () => {
    setCustomAmount("");
    setSelectedAmount(DEFAULT_PRESET);
  };

  const handleGiftTrees = () => {
    if (treeCount <= 0) return;
    dispatch(addTreeCountToCart({ cartGroupId, treeCount, treeCostTotal: totalPrice }));
  };

  const handleClearTrees = () => {
    dispatch(addTreeCountToCart({ cartGroupId, treeCount: 0, treeCostTotal: 0 }));
    handleReset();
  };

  // sync state when gifted trees are loaded (e.g. on page refresh or re-render)
  useEffect(() => {
    if (!isGifted) return;

    if (isPreset) {
      setSelectedAmount(defaultTreeCount);
      setCustomAmount("");
    } else {
      setCustomAmount(String(defaultTreeCount));
    }
  }, [defaultTreeCount, isGifted, isPreset]);

  return (
      <Card className="w-full rounded-none">
        <CardContent className="space-y-3">
          {/* Header */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Number of trees to be planted:
            </h2>
            {isGifted && (
              <p className="text-sm text-green-600 mt-1">
                ✓ {defaultTreeCount} trees gifted (<FormatCurrency fixed amount={defaultTreeCostTotal} decimals={2} />)
              </p>
            )}
          </div>

          {/* Preset Amount Buttons */}
          <div className="flex flex-row gap-2 flex-wrap">
            {PRESET_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className={`h-12 px-5 text-base font-medium cursor-pointer ${
                  selectedAmount === amount && !isCustomSelected
                    ? "border-2 border-primary-black bg-primary-black/10 text-primary-black"
                    : ""
                }`}
                onClick={() => handlePresetClick(amount)}
              >
                {amount}
              </Button>
            ))}
          </div>

          {/* Custom Tree Count */}
          <div className="space-y-2">
            <h3 className="text-base font-medium text-gray-900">Custom Tree</h3>
            <div className="relative">
              <Input
                type="number"
                step="1"
                min={0}
                placeholder="Enter number of trees"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="h-10 pr-12 rounded-md focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-black text-base md:text-base py-5 border-gray-400"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Price Display */}
          <div className="pt-2 flex items-center justify-between">
            <p className="text-xl font-semibold text-gray-900">
              <FormatCurrency fixed amount={totalPrice} decimals={2} /> GBP
              <ConvertedEstimate amount={totalPrice} className="font-medium text-gray-600 mt-0" />
            </p>
            <p className="text-sm text-gray-500">
              {treeCount} tree{treeCount !== 1 ? "s" : ""} × £{PRICE_PER_TREE}
            </p>
          </div>

          {/* Gift / Clear Button */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleGiftTrees}
              disabled={treeCount <= 0}
              className="flex-1 py-5 bg-black text-white hover:bg-black/90 text-sm font-medium disabled:opacity-50 cursor-pointer rounded-none"
            >
              <Gift className="mr-2 h-5 w-5" />
              {isGifted ? "UPDATE TREES GIFT" : "GIFT TREES"}
            </Button>

            {isGifted && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearTrees}
                className="py-5 px-4 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-md"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

  );
}
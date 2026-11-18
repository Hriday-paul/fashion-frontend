"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IProduct } from "@/types";
import GbpInput from "@/components/shared/GbpInput";
import { DropPrice } from "@/lib/Actions/Product.api";
import { cn } from "@/lib/utils";
import { MoveDown, Plus } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

const reportSchema = z.object({
    offerPrice: z.string({ required_error: "Price is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a valid positive number.",
    }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportUserDialogProps {
    product: IProduct;
}

export function DropPriceComponenet({
    product
}: ReportUserDialogProps) {
    const { formatGbp: format } = useCurrency();
    const [open, setOpen] = useState(false);
    const [offerPrice, setOfferPrice] = useState<number>(0);
    const [customPriceInput, setCustomPriceInput] = useState<string>("");
    const [isCustomOffer, setIsCustomOffer] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [customPriceError, setCustomPriceError] = useState<string | null>(null);

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await DropPrice({ payload: { productId: product?.id, newPrice: Number(offerPrice) } });
            if (!res.success) {
                throw new Error(res.message);
            }
            setOpen(false);
            setOfferPrice(0);
            setCustomPriceInput("");
        } catch (err: any) {
            setError(err?.message || "Failed to send offer");
        } finally {
            setIsLoading(false);
        }
    };

    const offerData = [
        {
            id: 1,
            discount: 10,
            price: product?.finalPrice - (product?.finalPrice * 10) / 100,
        },
        {
            id: 2,
            discount: 20,
            price: product?.finalPrice - (product?.finalPrice * 20) / 100,
        },
        {
            id: 3,
            discount: 30,
            price: product?.finalPrice - (product?.finalPrice * 30) / 100,
        },
    ];

    // Validates the custom price input and returns an error message, or null if valid.
    const validateCustomPrice = (rawValue: string): string | null => {
        if (rawValue.trim() === "") {
            return "Please enter an offer price.";
        }

        // Only allow digits and a single decimal point.
        if (!/^\d*\.?\d*$/.test(rawValue)) {
            return "Only numbers are allowed.";
        }

        const numericValue = Number(rawValue);

        if (isNaN(numericValue)) {
            return "Price must be a valid number.";
        }

        if (numericValue <= 0) {
            return "Price must be greater than 0.";
        }

        if (numericValue >= product?.finalPrice) {
            return `Offer must be lower than the current price of ${format(product?.finalPrice)}.`;
        }

        return null;
    };

    const handleCustomPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setCustomPriceInput(rawValue);

        const validationError = validateCustomPrice(rawValue);
        setCustomPriceError(validationError);

        setOfferPrice(validationError ? 0 : Number(rawValue));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button onClick={() => setOpen(open)} size={"sm"} variant={"outline"} className='border border-primary-black h-8 px-2 text-sm font-medium rounded-none cursor-pointer'>Drop Price</Button>
            </DialogTrigger>

            <DialogContent className="w-[450px] rounded-none overflow-y-auto max-h-screen">

                <DialogHeader className="border-b border-gray-200 pb-3.5">
                    <h2 className="text-base font-medium text-center">Drop Price</h2>
                </DialogHeader>

                <div className="space-y-4">

                    <p className="text-base text-gray-900"><span className="font-semibold text-primary-black" >Current Price :</span> {format(product?.finalPrice)}</p>


                    <p className="text-sm text-gray-800"> Drop the price and notify your followers and interested buyers automatically.</p>

                    <div className="">

                        <div className={cn("grid grid-cols-4 items-center gap-3 flex-wrap")}>
                            {offerData?.map((item) => (
                                <button
                                    key={item?.id}
                                    onClick={() => {
                                        setIsCustomOffer(false);
                                        setCustomPriceError(null);
                                        setOfferPrice(item?.price);
                                    }}
                                    className={cn("text-center py-2 px-5 rounded border border-gray-200 cursor-pointer shadow-sm text-sm h-full font-medium text-gray-700", offerPrice === item?.price && "border-primary-black bg-zinc-50")}
                                >
                                    <div className="flex flex-row gap-x-0.5 items-center">
                                        <MoveDown className="size-3" />
                                        {item?.discount}%
                                    </div>
                                    <span className="font-semibold text-primary-black">{format(item?.price)}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    setIsCustomOffer(true);
                                    setOfferPrice(0);
                                    setCustomPriceInput("");
                                    setCustomPriceError(null);
                                }}
                                className={cn("text-center py-2 px-5 rounded border border-gray-200 cursor-pointer h-full shadow flex flex-col items-center justify-center tex-sm", isCustomOffer && "border-gray-600 bg-zinc-50")}
                            >
                                <Plus />
                                Custom
                            </button>
                        </div>

                        {isCustomOffer && <div className="py-5">
                            <p className="text-sm font-medium text-black mb-2">Custom Price (£ GBP)</p>
                            <GbpInput
                                placeholder="Set your own price in GBP"
                                value={customPriceInput}
                                onChange={handleCustomPriceChange}
                                aria-invalid={!!customPriceError}
                                groupClassName={customPriceError ? "border-red-400" : undefined}
                            />
                            {customPriceError && (
                                <p className="text-[#E12728] text-sm mt-1.5">{customPriceError}</p>
                            )}
                        </div>}

                    </div>

                    {error && (
                        <div className="rounded border border-red-300 bg-red-50 px-3 py-2">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}


                    <div className="mt-5 flex gap-2">
                        <Button disabled={offerPrice === 0 || isLoading}
                            onClick={onSubmit}
                            className="w-full h-11 rounded-none cursor-pointer">
                            {isLoading ? <span className="loader" /> : "Update Price"}
                        </Button>
                    </div>

                </div>

            </DialogContent>
        </Dialog >
    );
}


export default DropPriceComponenet
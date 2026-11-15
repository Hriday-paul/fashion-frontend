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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { IOffer } from "@/types";
import { Input } from "@/components/ui/input";
import { defaultImg } from "@/utils/defaultImg";
import Image from "next/image";
import Link from "next/link";
import { SendCounterOffer } from "@/lib/Actions/Product.api";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "sonner";

const reportSchema = z.object({
    offerPrice: z.string({ required_error: "Price is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a valid positive number.",
    }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportUserDialogProps {
    offer: IOffer;
}

export function CounterOffer({
    offer
}: ReportUserDialogProps) {
    const { format } = useCurrency();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema)
    });

    const onSubmit = async (data: ReportFormValues) => {
        try {
            const res = await SendCounterOffer({ payload: { offerId: offer?.id, offerPrice: Number(data.offerPrice) } });
            if (!res.success) {
                throw new Error(res.message);
            }
            toast.success(res.message || "Counter offer sent successfully");
            setOpen(false);
            form.reset();
        } catch (err: any) {
            setError(err?.message || "Failed to send counter offer");
            toast.error(err?.message || "Failed to send counter offer");
        }
    };

    const after_20_percent = offer?.actualPrice - ((offer?.actualPrice * 30) / 100);
    const after_5_Percent = offer?.actualPrice - ((offer?.actualPrice * 10) / 100);

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} variant={"outline"} className="cursor-pointer border-primary-black">
                    Counter
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[450px] rounded-none overflow-y-auto max-h-screen">

                <DialogHeader className="border-b border-gray-200 pb-3.5">
                    <h2 className="text-base font-medium text-center">Counter Offer</h2>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="flex flex-row gap-x-3 items-center">
                        <p className="text-base text-gray-900"><span className="font-semibold text-primary-black" >Total Price :</span> {format(offer?.actualPrice)}</p>
                        <p className="text-base text-gray-900"><span className="text-primary-black font-semibold" >Offered Price :</span> {format(offer?.offeredPrice)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-800">You are about to make a counter offer for the following items:</p>
                    </div>

                    <ul className="px-4">
                        {offer?.offerItems.map((item) => (
                            <li key={item?.id} className="flex items-center gap-4 border-b border-stone-200 pb-4 last:border-b-0">
                                <Link href={`/shop/${item?.product?.id}`}>
                                    <Image
                                        src={item.product?.images[0]?.url || defaultImg?.product}
                                        alt={item?.product?.title}
                                        className="h-16 w-16 rounded-md object-cover"
                                        height={800}
                                        width={800}
                                    />
                                </Link>

                                <Link href={`/shop/${item?.product?.id}`}>
                                    <div className="flex-1">
                                        <p className="text-base text-stone-900">
                                            {item?.product?.title}
                                        </p>
                                        <span className="text-sm text-primary-black font-semibold">
                                            {format(item?.product?.finalPrice)}
                                        </span>
                                    </div>
                                </Link>


                            </li>
                        ))}
                    </ul>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 border-b border-gray-200 pb-4">
                            <FormField
                                control={form.control}
                                name="offerPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Offer Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your offer price"
                                                type="text"
                                                className="bg-white border-[#e1e1e1] md:py-5 rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black text-lg md:text-base py-5"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {error && (
                                <div className="rounded border border-red-300 bg-red-50 px-3 py-2">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <Button
                                disabled={form.formState.isSubmitting}
                                //  disabled={offerPrice === 0 || isLoading} 
                                //  onClick={handleSendOffer}
                                className="w-full h-11 rounded-none cursor-pointer">
                                {form.formState.isSubmitting ? <span className="loader" /> : "Send Offer"}
                            </Button>

                        </form>
                    </Form>

                    <p className="text-gray-700 text-sm"><span className="text-primary-black font-semibold">Note : </span>Buyer respond better to higher discount offers. Try offering a discount between <span className="font-semibold text-primary-black">{format(after_20_percent)} - {format(after_5_Percent)}</span></p>

                </div>
            </DialogContent>
        </Dialog >
    );
}


export default CounterOffer
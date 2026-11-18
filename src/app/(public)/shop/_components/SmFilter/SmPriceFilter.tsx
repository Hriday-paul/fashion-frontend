"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const schema = z.object({
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
});

const sanitizeDigits = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, "");
    // remove leading zeros ("00" -> "", "007" -> "7", "0" -> "")
    const noLeadingZeros = digitsOnly.replace(/^0+/, "");
    return noLeadingZeros;
};

// belt-and-suspenders: also block the keys that type=number would otherwise accept
const blockInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["-", "+", "e", "E", ".", ",", " "].includes(e.key)) {
        e.preventDefault();
    }
};

export default function SmPriceFilter() {
    const searchParams = useSearchParams()

    const selectedMinPrice = searchParams.get("priceMin")
    const selectedMaxPrice = searchParams.get("priceMax")

    const router = useRouter();

    const pathname = usePathname();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            minPrice: selectedMinPrice ?? "",
            maxPrice: selectedMaxPrice ?? "",
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {

        const params = new URLSearchParams(searchParams.toString());

        if (data.minPrice) {
            params.set("priceMin", data.minPrice);
        } else {
            params.delete("priceMin");
        }

        if (data.maxPrice) {
            params.set("priceMax", data.maxPrice);
        } else {
            params.delete("priceMax");
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleReset = () => {
        form.reset({ minPrice: "", maxPrice: "" });
    };

    return (
        <div className='p-4'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onReset={handleReset}
                    className="p-2">

                    <div className='grid grid-cols-2 gap-5'>

                        <FormField
                            control={form.control}
                            name="minPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            inputMode="numeric"
                                            onKeyDown={blockInvalidKeys}
                                            onChange={(e) => field.onChange(sanitizeDigits(e.target.value))}
                                            className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black text-base h-12"
                                            placeholder="£ Min GBP"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="maxPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            inputMode="numeric"
                                            onKeyDown={blockInvalidKeys}
                                            onChange={(e) => field.onChange(sanitizeDigits(e.target.value))}
                                            className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black h-12 text-base"
                                            placeholder="£ Max GBP"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                    </div>

                    <div className='grid grid-cols-2 items-center gap-2'>
                        <Button size={"lg"} type='reset' variant={"outline"} className="cursor-pointer gap-2 disabled:cursor-not-allowed rounded-none mt-4 h-12 px-4 text-sm w-full">
                            Reset
                        </Button>
                        <Button size={"lg"} type='submit' className="cursor-pointer gap-2 disabled:cursor-not-allowed rounded-none mt-4 h-12 px-4 text-sm w-full">
                            Done
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    )
}
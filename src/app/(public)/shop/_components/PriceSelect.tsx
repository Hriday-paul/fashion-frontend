"use client"
import React from 'react'
import { ChevronDown, } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from '@/lib/utils';
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

export default function PriceSelect() {
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

    const isPriceSelected = selectedMinPrice || selectedMaxPrice;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn("justify-between hover:bg-zinc-50 duration-150 border border-gray-300 shadow-none cursor-pointer rounded px-2.5 h-8", isPriceSelected && "border-gray-700")}>
                    <span className="flex items-center gap-2">
                        <span className={cn("text-foreground text-base font-normal", isPriceSelected && "font-semibold")}>Price</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 rounded-none w-60" align='start'>

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
                                                className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black text-sm h-10"
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
                                                className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 border focus-visible:border-primary-black text-sm h-10"
                                                placeholder="£ Max GBP"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                        </div>

                        <div className='flex justify-between flex-row items-center gap-2'>
                            <Button size={"lg"} type='reset' variant={"outline"} className="cursor-pointer gap-2 disabled:cursor-not-allowed rounded-none mt-4 h-8 px-4 text-sm">
                                Reset
                            </Button>
                            <Button size={"lg"} type='submit' className="cursor-pointer gap-2 disabled:cursor-not-allowed rounded-none mt-4 h-8 px-4 text-sm">
                                Done
                            </Button>
                        </div>

                    </form>
                </Form>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
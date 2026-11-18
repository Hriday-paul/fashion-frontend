"use client"
import { Checkbox } from '@/components/ui/checkbox'
import React, { useCallback } from 'react'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from '@/lib/utils';

function FilterSold() {

    const searchParams = useSearchParams()
    const router = useRouter();
    const pathname = usePathname();
    const selectedStock = searchParams.get("stock");

    const updateQueryParam = useCallback(
        (key: string, value: string, targetId?: string) => {
            const currentValues = searchParams.get(key)?.split(",") || [];

            let newValues: string[];
            if (currentValues.includes(value)) {
                newValues = currentValues.filter((v) => v !== value);
            } else {
                newValues = [...currentValues, value];
            }

            const params = new URLSearchParams(searchParams.toString());
            if (newValues.length > 0) {
                params.set(key, newValues.join(","));
            } else {
                params.delete(key);
            }

            router.push(`${pathname}?${params.toString()}`, { scroll: false });

            setTimeout(() => {
                if (targetId) {
                    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
                }
            }, 50);
        },
        [searchParams, router, pathname]
    );

    const handleSelect = () => {
        updateQueryParam("stock", "in-sale")
    }

    const isSale = selectedStock === "in-sale";

    return (
        <div
            onClick={handleSelect}
            className={cn(
                "justify-between hover:bg-zinc-50 duration-150 border border-gray-300 shadow-none cursor-pointer rounded px-2.5 h-8 flex flex-row items-center gap-2",
                isSale && "border-gray-700"
            )}
        >
            <Checkbox
                className='rounded-xs border-gray-500 data-[state=checked]:text-white'
                checked={isSale}
                onCheckedChange={handleSelect}
            />
            <p>In Sale</p>
        </div>
    )
}

export default FilterSold
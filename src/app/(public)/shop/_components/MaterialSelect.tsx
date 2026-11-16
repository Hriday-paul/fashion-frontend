"use client"
import React, { useCallback, useState } from 'react'
import { ChevronDown, Search, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from '@/components/ui/skeleton'
import { useGetMaterialsQuery } from '@/redux/api/material.api'

// Search box + checkbox list of materials, toggles ids in the `material` URL param.
export function MaterialOptions({ categoryId }: { categoryId?: string }) {
    const searchParams = useSearchParams()
    const router = useRouter();
    const pathname = usePathname();
    const selected = searchParams.get("material")?.split(",") || [];

    const [query, setQuery] = useState("");

    const { data, isLoading } = useGetMaterialsQuery({ categoryId });

    const toggle = useCallback((id: string) => {
        const current = searchParams.get("material")?.split(",") || [];
        const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];

        const params = new URLSearchParams(searchParams.toString());
        if (next.length > 0) {
            params.set("material", next.join(","));
        } else {
            params.delete("material");
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    const filtered = data?.data?.filter((m) =>
        m.name.toLowerCase().includes(query.trim().toLowerCase())
    );

    return (
        <>
            <div className="flex items-center gap-2 bg-white border-b px-3 border-gray-300 hover:bg-zinc-100">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Find a material"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground py-3"
                    onKeyDown={(e) => e.stopPropagation()}
                />
                {query && (
                    <button type="button" className="cursor-pointer" onClick={() => setQuery("")}>
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="p-3 space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                </div>
            ) : filtered?.length ? (
                filtered.map((m) => (
                    <div key={m.id} onClick={() => toggle(m.id)} className="p-0 border-b border-gray-200 last:border-b-0">
                        <button className="w-full flex items-center justify-between p-3 hover:bg-accent transition-colors text-left cursor-pointer">
                            <span className="text-sm font-medium">{m.name}</span>
                            <Checkbox className='rounded-xs border-gray-500 data-[state=checked]:text-white' checked={selected.includes(m.id)} />
                        </button>
                    </div>
                ))
            ) : (
                <div className="p-3 text-sm text-muted-foreground text-center">
                    No materials found
                </div>
            )}
        </>
    )
}

export default function MaterialSelect({ categoryId }: { categoryId?: string }) {
    const searchParams = useSearchParams()
    const isSelected = (searchParams.get("material")?.split(",") || []).filter(Boolean).length > 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn("justify-between hover:bg-zinc-50 duration-150 border border-gray-300 shadow-none cursor-pointer rounded px-2.5 h-8", isSelected && "border-gray-700")}>
                    <span className="flex items-center gap-2">
                        <span className={cn("text-foreground text-base font-normal", isSelected && "font-semibold")}>Material</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 rounded-none w-60 max-h-96 overflow-y-auto" align='start'>
                <MaterialOptions categoryId={categoryId} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

"use client"
import React, { useCallback } from 'react'
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from '@/lib/utils';
import { useGetSizeGroupsQuery } from '@/redux/api/size.api';
import { ISizeGroupItem } from '@/types'

// group name first, then the sizes of that group
const BuildDropdownItem = ({
    groups,
    selectedSizes,
    onSelect,
}: {
    groups: ISizeGroupItem[]
    selectedSizes: string[]
    onSelect: (id: string) => void
}) => {
    return (
        <div>
            {groups.map((group) => (
                <div key={group.id}>
                    <p className='px-4 pt-3 pb-1 text-sm font-semibold'>{group.groupName}</p>
                    <div className='flex flex-row gap-2 flex-wrap p-2'>
                        {group.sizes.map((size) => {
                            const isSelected = selectedSizes.includes(size.id);
                            return (
                                <Button
                                    key={size.id}
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    className='rounded-none shadow-none cursor-pointer'
                                    onClick={() => onSelect(size.id)}
                                >
                                    {size.title}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function SizeSelect({ categoryId }: { categoryId?: string }) {

    const searchParams = useSearchParams()

    const { data: sizes, isLoading, isError, isSuccess } = useGetSizeGroupsQuery({ categoryId });

    const selectedSizes = searchParams.get("size")?.split(",") || [];

    const router = useRouter();

    const pathname = usePathname();

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
        [searchParams, router]
    );

    const handleSelect = (size: string) => {
        updateQueryParam("size", size)
    }

    const isSizeSelected = selectedSizes.length > 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn("justify-between hover:bg-zinc-50 duration-150 border border-gray-300 shadow-none cursor-pointer rounded px-2.5 h-8", isSizeSelected && "border-gray-700")}>
                    <span className="flex items-center gap-2">
                        <span className={cn("text-foreground text-base font-normal", isSizeSelected && "font-semibold")}>Size</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 rounded-none w-64 max-h-[450px] overflow-y-auto" align='start'>

                {isLoading ? <div className="flex-center h-24 lg:h-32">
                    <span className="loaderDark !w-10"> </span>
                </div> : isSuccess ? <>

                    {sizes?.data?.length ? (
                        <BuildDropdownItem
                            groups={sizes.data}
                            selectedSizes={selectedSizes}
                            onSelect={handleSelect}
                        />
                    ) : (
                        <div className="p-3 text-sm text-muted-foreground text-center">
                            No sizes found
                        </div>
                    )}

                </> : isError ? <div className="p-3 text-sm text-muted-foreground text-center">
                    Error loading sizes
                </div> : <></>}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

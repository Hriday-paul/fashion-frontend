"use client"
import { useCallback } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useGetSizeGroupsQuery } from '@/redux/api/size.api'
import { Checkbox } from '@/components/ui/checkbox'

export const RadioIndicator = ({ selected }: { selected: boolean }) => (
    selected ? (
        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center ml-3 shrink-0">
            <div className="w-2 h-2 rounded-full bg-white" />
        </div>
    ) : (
        <div className="w-5 h-5 rounded-full border-2 border-gray-400 ml-3 shrink-0" />
    )
)

function SmSizeFilter({ categoryId }: { categoryId?: string }) {
    const { isLoading, isSuccess, isError, data } = useGetSizeGroupsQuery({ categoryId })
    const searchParams = useSearchParams()
    const selectedItems = searchParams.get("size")?.split(",") || []

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

            // optional scroll to element
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

    if (isLoading) return (
        <div className="flex-center h-24 lg:h-32">
            <span className="loaderDark !w-10"> </span>
        </div>
    )

    if (isError) return <div className="flex-center h-24 lg:h-32">Error loading sizes</div>

    const groups = isSuccess ? data?.data ?? [] : []

    // group name first, then the sizes of that group
    return (
        <div>
            {groups.length ? (
                groups.map((group) => (
                    <div key={group.id}>
                        <p className="px-3 pt-3 pb-1 text-sm font-semibold text-gray-600">{group.groupName}</p>
                        {group.sizes.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(item.id)}
                                className="w-full flex justify-between items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                            >
                                <span className="text-base">{item.title}</span>
                                <Checkbox className="rounded-xs border-gray-500 data-[state=checked]:text-white" checked={selectedItems.includes(item.id)} />
                            </button>
                        ))}
                    </div>
                ))
            ) : (
                <div className="p-3 text-sm text-muted-foreground text-center">
                    No sizes found
                </div>
            )}
        </div>
    )
}

export default SmSizeFilter

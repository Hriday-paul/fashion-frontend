"use client"
import { Skeleton } from '@/components/ui/skeleton';
import { useFilteredAttributesQuery } from '@/redux/api/categoryApi';
import { X } from 'lucide-react';
import { useGetMaterialsQuery } from '@/redux/api/material.api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react'
import { useCurrency } from '@/hooks/useCurrency';

const conditionMap: { [key: string]: string } = {
    "new": "New",
    "like-new": "Like New",
    "3-months-used": "3 Months Used",
    "6-months-used": "6 Months Used",
    "1-year-used": "1 Year Used",
    "well-used": "Well Used"
};

function SelectedAttributes({ ssp }: { ssp: { [key: string]: string | undefined } }) {
    const { symbol } = useCurrency();
    const { category, brand, size, priceMin, priceMax, color, condition, search, stock } = ssp;

    const { data: filteredAttributes, isLoading, isError, isSuccess } = useFilteredAttributesQuery({ categoryId: category, brands: brand, sizes: size });

    const searchParams = useSearchParams();

    const router = useRouter();

    const pathname = usePathname();

    const colors = color?.split(",") || [];
    const materialIds = ssp.material?.split(",").filter(Boolean) || [];
    const { data: materialsData } = useGetMaterialsQuery({});
    const conditions = condition?.split(",") || [];

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

    return (
        <>
            <div className='flex flex-row gap-3 items-center flex-wrap'>

                {
                    isLoading ? <Skeleton className='bg-zinc-200 h-8 w-20 rounded-full' /> : isSuccess && filteredAttributes?.data?.category && (
                        <div className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                            <p className='text-base text-gray-800'>{filteredAttributes?.data?.category?.name}</p>
                            <button onClick={() => updateQueryParam('category', filteredAttributes?.data?.category?.id || "")} className='cursor-pointer'><X className='size-4' /></button>
                        </div>
                    )
                }

                {
                    search && <div className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                        <p className='text-base text-gray-800'>{search}</p>
                        <button onClick={() => updateQueryParam('search', search)} className='cursor-pointer'><X className='size-4' /></button>
                    </div>
                }

                {
                    isLoading ? <div className='flex flex-row gap-x-3 items-center flex-wrap'>
                        <Skeleton className='bg-zinc-200 h-8 w-20 rounded-full' />
                    </div> : isSuccess && filteredAttributes?.data && (
                        filteredAttributes?.data?.brandList.length > 0 && <div className='flex flex-row gap-x-3 items-center flex-wrap'>
                            {
                                filteredAttributes?.data?.brandList?.map((brand) => (<div key={brand?.id} className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                                    <p className='text-base text-gray-800'>{brand?.name}</p>
                                    <button onClick={() => updateQueryParam('brand', brand?.id)} className='cursor-pointer'><X className='size-4' /></button>
                                </div>))
                            }
                        </div>
                    )
                }

                {
                    priceMin && <div className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                        <p className='text-base text-gray-800'>More than {symbol}{priceMin}</p>
                        <button onClick={() => updateQueryParam('priceMin', priceMin)} className='cursor-pointer'><X className='size-4' /></button>
                    </div>
                }

                {
                    priceMax && <div className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                        <p className='text-base text-gray-800'>Less than {symbol}{priceMax}</p>
                        <button onClick={() => updateQueryParam('priceMax', priceMax)} className='cursor-pointer'><X className='size-4' /></button>
                    </div>
                }

                {
                    isLoading ? <div className='flex flex-row gap-x-3 items-center flex-wrap'>
                        <Skeleton className='bg-zinc-200 h-8 w-20 rounded-full' />
                    </div> : isSuccess && filteredAttributes?.data && (
                        filteredAttributes?.data?.sizeList.length > 0 && <div className='flex flex-row gap-x-3 items-center flex-wrap'>
                            {
                                filteredAttributes?.data?.sizeList?.map((size) => (<div key={size?.id} className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                                    <p className='text-base text-gray-800'>{size?.title}</p>
                                    <button onClick={() => updateQueryParam('size', size?.id)} className='cursor-pointer'><X className='size-4' /></button>
                                </div>))
                            }
                        </div>
                    )
                }

                {
                    colors?.length > 0 && <div className='flex flex-row gap-x-3 items-center flex-wrap'>
                        {
                            colors.map((color) => (<div key={color} className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                                <p className='text-base text-gray-800'>{color}</p>
                                <button onClick={() => updateQueryParam('color', color)} className='cursor-pointer'><X className='size-4' /></button>
                            </div>))
                        }
                    </div>
                }

                {
                    materialIds.length > 0 && <div className='flex flex-row gap-x-3 items-center flex-wrap'>
                        {
                            materialIds.map((id) => (<div key={id} className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                                <p className='text-base text-gray-800'>{materialsData?.data?.find((m) => m.id === id)?.name || "Material"}</p>
                                <button onClick={() => updateQueryParam('material', id)} className='cursor-pointer'><X className='size-4' /></button>
                            </div>))
                        }
                    </div>
                }

                {
                    conditions?.length > 0 && <div className='flex flex-row gap-x-3 items-center flex-wrap'>
                        {
                            conditions.map((condition) => (<div key={condition} className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                                <p className='text-base text-gray-800'>{conditionMap[condition] || condition}</p>
                                <button onClick={() => updateQueryParam('condition', condition)} className='cursor-pointer'><X className='size-4' /></button>
                            </div>))
                        }
                    </div>
                }

                {
                    stock && <div className='bg-zinc-100 rounded-full px-3.5 py-0.5 hover:bg-zinc-50 cursor-pointer flex-row gap-x-1 items-center inline-flex'>
                        <p className='text-base text-gray-800'>{stock}</p>
                        <button onClick={() => updateQueryParam('stock', stock)} className='cursor-pointer'><X className='size-4' /></button>
                    </div>
                }

            </div>
        </>
    )
}

export default SelectedAttributes
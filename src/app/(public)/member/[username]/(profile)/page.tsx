import ProfileFeatures from '@/components/shared/UserProfile/ProfileFeatures/ProfileFeatures'
import { ProductGridSkeleton } from '@/components/skeletons/ProductsCardSkeleton';
import React from 'react'
import { Suspense } from 'react';
import SellerBundleTiers from '../_components/SellerBundleTiers';
import CategorySelectClient, { SelectCatBypath } from '@/app/(public)/shop/_components/CategorySelectClient';
import BrandSelect from '@/app/(public)/shop/_components/BrandSelect';
import PriceSelect from '@/app/(public)/shop/_components/PriceSelect';
import SizeSelect from '@/app/(public)/shop/_components/SizeSelect';
import ColorSelect from '@/app/(public)/shop/_components/ColorSelect';
import MaterialSelect from '@/app/(public)/shop/_components/MaterialSelect';
import ConditionSelect from '@/app/(public)/shop/_components/ConditionSelect';
import { SellerProfileProductSorting } from '@/components/shared/CategoryFilter/SellerProfileProductSorting';
import { SmallDeviceFilter } from '@/app/(public)/shop/_components/SmallDeviceFilter';
import SelectedAttributes from '@/app/(public)/shop/_components/SelectedAttributes';
import FilterSold from '@/app/(public)/shop/_components/FilterSold';

async function SellerProducts({ params, searchParams }: { params: Promise<{ username: string }>, searchParams: Promise<{ [key: string]: string | undefined }> }) {

  const { username } = await params;

  const ssp = await searchParams;

  const { category } = ssp;

  return (
    <div className='space-y-5'>

      <SellerBundleTiers userName={username} />

      <div className='space-y-5'>
        {/* ----------------------------------------- show filter option ------------------------------------- */}
        <SelectCatBypath categoryId={category} />

        {/* ----------------------lg filter-------------------------- */}
        <div className="hidden lg:flex flex-row justify-between gap-x-4 items-center">

          <div className="flex flex-row flex-wrap items-center gap-4">
            <CategorySelectClient selectedCat={category} />

            <BrandSelect categoryId={category} />

            <PriceSelect />

            <SizeSelect categoryId={category} />

            <ColorSelect />

            <MaterialSelect categoryId={category} />

            <ConditionSelect />

            <FilterSold />
          </div>

          <SellerProfileProductSorting />

        </div>

        <div className="lg:hidden flex justify-end items-center">
          <SmallDeviceFilter categoryId={category} sspResult={ssp}></SmallDeviceFilter>
        </div>

        <div className="hidden md:block">
          <SelectedAttributes ssp={ssp} />
        </div>
      </div>

      <Suspense key={Date.now()} fallback={<ProductGridSkeleton />}>
        <ProfileFeatures userName={username} searchParams={ssp} />
      </Suspense>
    </div>
  )
}

export default SellerProducts
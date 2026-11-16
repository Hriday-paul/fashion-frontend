import Container from "@/components/shared/Container";
import React, { Suspense } from "react";
import ShopPageContainer from "./_components/ShopPageContainer";
import { ProductGridSkeleton } from "@/components/skeletons/ProductsCardSkeleton";
import GetProducts from "@/lib/services/Products";
import { SmallDeviceFilter } from "./_components/SmallDeviceFilter";
import CategorySelectClient, { SelectCatBypath } from "./_components/CategorySelectClient";
import BrandSelect from "./_components/BrandSelect";
import PriceSelect from "./_components/PriceSelect";
import SizeSelect from "./_components/SizeSelect";
import ColorSelect from "./_components/ColorSelect";
import MaterialSelect from "./_components/MaterialSelect";
import ConditionSelect from "./_components/ConditionSelect";
import { SellerProfileProductSorting } from "@/components/shared/CategoryFilter/SellerProfileProductSorting";
import SelectedAttributes from "./_components/SelectedAttributes";

export const metadata = {
  title: "Shop",
  description: "Enjoy your shopping with Fashion!",
};

const ShopPage = async ({ searchParams: ssp }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {

  const sspResult = await ssp;
  const { category, sortBy: sort, brand, priceMin, priceMax, size, color, condition, search, material } = sspResult;

  let sortBy = "createdAt";
  let orderBy = "desc"

  if (sort == "newest") {
    orderBy = "desc"
  } else if (sort == "-price") {
    sortBy = "finalPrice";
    orderBy = "asc"
  }
  else if (sort == "price") {
    sortBy = "finalPrice";
    orderBy = "desc"
  }

  const query: any = { sortBy, sortOrder: orderBy, limit: 24 }

  if (category) {
    query.category = category
  }

  if (brand) {
    query.brands = brand
  }
  if (priceMin) {
    query.minPrice = priceMin
  }
  if (priceMax) {
    query.maxPrice = priceMax
  }
  if (size) {
    query.sizes = size
  }
  if (color) {
    query.colors = color
  }
  if (material) {
    query.materials = material
  }
  if (condition) {
    query.conditions = condition
  }
  if (search) {
    query.searchTerm = search
  }

  const prodsPromise = GetProducts({ query });

  return (

    <Container>
      <div className="space-y-5">

        {/* ----------------------------------------- show filter option ------------------------------------- */}
        <div className="pt-5">
          <SelectCatBypath categoryId={category} />
        </div>

        {/* ----------------------lg filter-------------------------- */}
        <div className="hidden lg:flex flex-row justify-between gap-x-4 items-center mt-5">

          <div className="flex flex-row flex-wrap items-center gap-4">
            <CategorySelectClient selectedCat={category} />

            <BrandSelect categoryId={category} />

            <PriceSelect />

            <SizeSelect categoryId={category} />

            <ColorSelect />

            <MaterialSelect categoryId={category} />

            <ConditionSelect />
          </div>

          <SellerProfileProductSorting />

        </div>

        <div className="lg:hidden flex justify-end mt-5 items-center">
          <SmallDeviceFilter categoryId={category} sspResult={sspResult}></SmallDeviceFilter>
        </div>

        <div className="hidden md:block">
          <SelectedAttributes ssp={sspResult} />
        </div>
        {/* ----------------------------------------- show products ------------------------------------- */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ShopPageContainer prodsPromise={prodsPromise} query={query} />
        </Suspense>


      </div>
    </Container>
  );
};

export default ShopPage;

import React from "react";
import ProductsListContainer from "../ProductsList/ProductsListContainer";
import { GetProductsByMember } from "@/lib/services/Products";
import GetUserDetails from "@/lib/services/UserDetails";
import { UserRole } from "@/types";

const ProfileFeatures = async ({
  userName,
  searchParams: ssp
}: {
  userName: string;
  searchParams: { [key: string]: string | undefined };
}) => {

  const { category, sortBy: sort, brand, priceMin, priceMax, size, color, condition, stock } = ssp;

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
  if (condition) {
    query.conditions = condition
  }
  if (stock) {
    query.stock = stock
  }

  const prodData = await GetProductsByMember({ query, userName });

  const user = await GetUserDetails({ userName });

  const isCharityShop = user?.data?.user?.auth?.role === UserRole.CHARITY_SHOP;

  const isMyProfile = user?.data?.isCurrentUser;

  const totalProducts = prodData?.data?.meta?.total || 0;

  return (
    <div>
      {totalProducts > 0 && <p className="font-semibold mb-3">{totalProducts} Items Available</p>}
      <ProductsListContainer initialData={prodData?.data?.data} initialMeta={prodData?.data?.meta} query={query} userName={userName} key={JSON.stringify(query)} isCharityShop={isCharityShop} user={user?.data?.user} />
    </div>
  );
};

export default ProfileFeatures;

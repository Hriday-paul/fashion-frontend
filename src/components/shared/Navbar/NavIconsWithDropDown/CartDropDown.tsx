"use client"
import FormatCurrency from "@/components/shared/FormatCurrency";
import { Button } from "@/components/ui/button";
import CustomAvatar from "@/components/ui/custom-avatar";
import { CartIcon } from "@/icons";
import { ICartGroup } from "@/types";
import { defaultImg } from "@/utils/defaultImg";
import Image from "next/image";
import Link from "next/link";
import DltCart from "./DltCart";
import { useGetMyCartItemsQuery } from "@/redux/api/cart.api";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";

export default function CartDropDown() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const { isLoading, data, isSuccess } = useGetMyCartItemsQuery();

  const itemsCount = data?.data?.reduce(
    (acc: number, cartGroup: ICartGroup) =>
      acc + (cartGroup?.items?.length || 0),
    0
  ) || 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className={cn("cursor-pointer relative focus-within:outline-none focus-within:ring-0 focus-within:ring-primary-black p-1.5", open && "bg-gray-100 rounded-md")}>
        <CartIcon className="size-5 lg:size-7" />

        {isSuccess && itemsCount > 0 && (
          <span className="absolute top-2 right-2 grid min-h-[20px] min-w-[20px] translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-600 px-0.75 py-0.5 text-[10px] text-white">
            {itemsCount < 100 ? itemsCount : `100+`}
          </span>
        )}

      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-xs rounded-none" align="start">

        <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
          <p className="text-base font-medium px-3 pt-2 pb-3 text-center">Shopping Cart</p>
        </div>

        {
          isLoading ? <div className="flex-center h-28">
            <span className="loaderDark !w-10"> </span>
          </div> : <CartProds cart={data?.data || []} closeMenu={closeMenu} />
        }

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const CartProds = ({ cart, closeMenu }: { cart: ICartGroup[], closeMenu: () => void; }) => {


  return <>
    {
      <div className="space-y-3 overflow-y-auto max-h-[450px]">
        {
          cart?.map((cartGroup) => (
            <DropdownMenuGroup key={cartGroup?.id} className="flex-none focus:bg-transparent px-2 pt-2">

              <div className="w-full">

                <div className="flex flex-row items-center gap-x-3">

                  <Link
                    href={`/member/${cartGroup?.seller?.userName}`}
                    className="cursor-pointer"
                    onClick={closeMenu}
                  >
                    <CustomAvatar image={cartGroup?.seller?.picture?.url || null} name={cartGroup?.seller?.userName} className="!size-10"></CustomAvatar>
                  </Link>

                  <div>
                    <Link
                      href={`/member/${cartGroup?.seller?.userName}`}
                      className="flex items-center cursor-pointer"
                      onClick={closeMenu}
                    >
                      <p className="font-bold text-lg leading-4">{cartGroup?.seller?.userName}</p>
                    </Link>
                    <Link
                      href={`/member/${cartGroup?.seller?.userName}`}
                      className="flex items-center cursor-pointer"
                      onClick={closeMenu}
                    >
                      <p className="underline underline-offset-1 text-sm">{cartGroup?.seller?._count?.products} items for sale</p>
                    </Link>


                  </div>

                </div>

                <DropdownMenuItem className="">
                  <div className="space-y-2">
                    {
                      cartGroup?.items?.map((item) => (
                        <React.Fragment key={item?.id}>
                          <div className="flex flex-row gap-x-2 items-start">
                            <Link
                              href={`/shop/${item?.product?.id}`}
                              onClick={closeMenu}
                              className="cursor-pointer shrink-0"
                            ><Image src={item?.product?.images?.[0]?.url || defaultImg?.product} alt={item?.product?.title} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} width={1000} height={1000} className="w-28 h-30 object-cover" />
                            </Link>
                            <div>
                              <Link
                                href={`/shop/${item?.product?.id}`}
                                className="block space-y-0.5"
                                onClick={closeMenu}
                              >
                                <p className="text-base font-medium line-clamp-1 text-gray-800">{item?.product?.title}</p>
                                <p className="text-lg font-semibold"><FormatCurrency withGbp amount={item?.product?.finalPrice} /></p>
                                <p className="text-sm text-gray-800">{item?.product?.size?.title}</p>
                              </Link>
                              <DltCart cartItemId={item?.id} productId={item?.product?.id} />
                            </div>
                          </div>

                        </React.Fragment>

                      ))
                    }
                    <Link href={`/checkout/cart/${cartGroup?.id}`} onClick={closeMenu}>
                      <Button variant={"default"} className="w-full mt-2 rounded-none py-5 border-2 border-primary-black cursor-pointer font-semibold">Checkout</Button>
                    </Link>
                  </div>
                </DropdownMenuItem>

              </div>

            </DropdownMenuGroup>
          ))
        }
      </div>
    }

    {cart?.length <= 0 && <div className="py-10">
      <Image src={"/empty_cart.gif"} unoptimized alt="empty-cart" className="h-24 w-auto mx-auto" height={500} width={500} />
      <p className="text-center text-gray-500 text-sm mt-1">No items in cart</p>
      <center>
        <Link href={"/shop"} onClick={closeMenu}>
          <Button variant={"default"} className="mt-2 mx-auto text-center rounded-none py-5 border-2 cursor-pointer font-semibold">Browse</Button>
        </Link>
      </center>
    </div>}

    {cart?.length > 0 && <Link href={"/shopping-cart"} onClick={closeMenu}>
      <Button variant={"outline"} className="w-full mt-2 rounded-none py-5 border-2 border-primary-black cursor-pointer font-semibold">View All</Button>
    </Link>}
  </>

}
import PaginationSection from "@/components/shared/Pagination/PaginationSection"
import GetOrdersBySeller from "@/lib/services/Orders"
import { IMeta, IOrder } from "@/types"

import SellItem from "./SellItem"
import Empty from "@/components/ui/empty"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function SaleProductTable({ ssp }: { ssp: { [key: string]: string | undefined } }) {

  const { page, sortBy: sort, status } = ssp;

  let sortBy = "createdAt";
  let orderBy = "desc"

  if (sort == "newest") {
    orderBy = "desc"
  } else if (sort == "-price") {
    sortBy = "subtotal";
    orderBy = "asc"
  }
  else if (sort == "price") {
    sortBy = "subtotal";
    orderBy = "desc"
  }

  const query: any = { sortBy, sortOrder: orderBy }

  if (page) {
    query.page = page
  }
  if (status && status !== "ALL") {
    query.status = status
  }

  const ordersResponse = await GetOrdersBySeller({ query }) as { data: { data: IOrder[], meta: IMeta } };

  const orders = ordersResponse?.data?.data || [];

  const meta = ordersResponse?.data?.meta || {};

  return (
    <div>


      <div className="">

        {
          orders?.map((order) => (
            <SellItem key={order.id} order={order} />
          ))
        }

        {
          orders?.length === 0 && <div className="py-20 md:py-24 lg:py-28 max-w-xs mx-auto">
            <Image src={"/emty-box.png"} unoptimized alt="empty-cart" className="h-16 lg:h-24 w-auto mx-auto" height={500} width={500} />
            <p className="text-center text-gray-900 text-base font-semibold lg:text-lg my-0.5">No orders available</p>
            <p className="text-center text-gray-700 text-sm">Please check back later or order a new item.</p>
          </div>
        }

      </div>


      <PaginationSection className="mt-5" current={Number(page) || 1} total={meta?.total || 1} />
    </div>
  )
}

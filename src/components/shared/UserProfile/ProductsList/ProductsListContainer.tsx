"use client"
import { IMeta, IProduct, IUser, UserRole } from "@/types";
import ProductCard from "../../Cards/ProductCard";
import { useRef } from "react";
import useLazyLoad from "@/hooks/useLazyLoad";
import Image from "next/image";
import { useLazyProductsGetByMemberQuery } from "@/redux/api/productApi";
import { Heart } from "lucide-react";
import ClothesDonationDialog from "../../Modal/clothesDonation/ClothesDonationDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Props = {
  query: { [key: string]: string | undefined },
  userName: string,
  initialData: IProduct[],
  initialMeta: IMeta,
  isCharityShop: boolean;
  isMyprofile: boolean;
  user: IUser
}

const ProductsListContainer = ({ query, userName, initialData, initialMeta, isCharityShop, user, isMyprofile }: Props) => {

  const [loadSellerProds, { isLoading }] = useLazyProductsGetByMemberQuery();
  const triggerRef = useRef(null);

  const cuser = useSelector((state: RootState) => state?.auth?.user);

  const loadNextPage = async (page: number) => {
    try {

      query.page = page.toString();

      const res = await loadSellerProds({ params: query, userName }).unwrap();
      const data = res?.data?.data || [];
      const meta = res?.data?.meta;

      // No meta or no data back -> treat as end of list
      const hasMore = meta ? meta.page < meta.totalPage : data.length > 0;

      return { data, hasMore };
    } catch (error) {
      return { data: [], hasMore: false };
    }
  }

  const { data, hasMore } = useLazyLoad<IProduct>({
    triggerRef,
    onGrabData: loadNextPage,
    options: {},
    initialData: initialData,
    initialPage: initialMeta?.page ? initialMeta.page + 1 : 2,
    initialHasMore: initialMeta ? initialMeta?.page < initialMeta?.totalPage : true
  });

  const isImCharity = cuser?.auth ? (cuser?.auth?.role == UserRole.CHARITABLE_ORGANIZATION || cuser?.auth?.role == UserRole.CHARITY_SHOP) : false;

  return (
    <div>

      {
        data?.length === 0 && !isLoading && ((isCharityShop && (!isImCharity || !isMyprofile)) ? <EmptyCharityShop user={user} /> : <div className="py-20 md:py-24 lg:py-28 max-w-md mx-auto">
          <Image src={"/emty-box.png"} unoptimized alt="empty-cart" className="h-16 lg:h-24 w-auto mx-auto" height={500} width={500} />

          <p className="text-center text-gray-900 font-semibold text-base lg:text-xl mb-2">No items available</p>

          <p className="text-center text-gray-700 text-sm lg:text-base">This seller hasn't listed any items yet. Check back later or browse other sellers to find something you like.</p>
        </div>)
      }

      {/* ========================= all products ========================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {data?.map((prod) => (
          <ProductCard data={prod} key={prod?.id} ownProduct={true}></ProductCard>
        ))}

        {hasMore && <div ref={triggerRef} style={{ height: 1 }} />}
      </div>

      {
        isLoading && hasMore && <div className="flex-center h-28 lg:h-40">
          <span className="loaderDark !w-10"> </span>
        </div>
      }

    </div>
  );
};

export default ProductsListContainer;

const EmptyCharityShop = ({ user }: { user: IUser }) => {
  return <div className="py-20 md:py-24 lg:py-28 max-w-md mx-auto">
    <Image src={"/emty-box.png"} unoptimized alt="empty-cart" className="h-16 lg:h-24 w-auto mx-auto" height={500} width={500} />
    <p className="text-center text-gray-900 font-semibold text-base lg:text-xl mb-2">No items available</p>

    <p className="text-center text-gray-700 text-sm lg:text-base">This charity shop hasn't listed any items yet.</p>
    <p className="text-center text-gray-700 text-sm lg:text-base">Check back soon or follow to be notified when new items are added.</p>

    <ClothesDonationDialog charityId={user?.id}>
      <button className="text-center w-full bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-[#0f172a] font-bold py-2.5 rounded-lg text-sm cursor-pointer inline-flex flex-row items-center gap-2 mt-4 justify-center transition-colors duration-100">
        <Heart />
        Donate clothes
      </button>
    </ClothesDonationDialog>

    {/* <button className="text-center w-full bg-white hover:bg-gray-50 text-[#0f172a] font-bold py-2.5 rounded-lg text-sm cursor-pointer mt-2 justify-center transition-colors duration-100 border border-black">
            Folow this charity shop
          </button> */}

  </div>
}

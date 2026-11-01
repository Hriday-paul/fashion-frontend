import Link from "next/link";
import ActionButtons from "../ActionButtons";
import SellerDetails from "../SellerDetails";
import { CheckIcon } from "@/icons";
import ProductDetailsHeader from "./ProductDetailsHeader";
import DisplayLargeDescriptionText from "@/components/shared/DisplayLargeDescriptionText";
import { IProduct, ISize, IUser } from "@/types";
import Sizechart from "../dialog/Sizechart";

export type IUserWithExtra = IUser & {
  _count: {
    products: number;
  },
  bundleDiscount: {
    tiers: {
      itemCount: number;
      discountPercent: number;
    }[]
  } | null;
};

export type IProductWithUser = Omit<IProduct, "user"> & {
  user: IUserWithExtra;
  _count: {
    cartItems: number;
    favourites: number;
  },
  sizechart: ISize[],
  isMyProduct: boolean
};

const ProductDetails = ({ product }: { product: IProductWithUser }) => {
  const isStockOut = product?.stock === 0;

  const isDeleted = product?.isDeleted;

  return (
    <div className="space-y-2 lg:space-y-3">
      {/* --------- product header ---------- */}
      <div >
        <ProductDetailsHeader product={product} isMyProduct={product?.isMyProduct} />
      </div>

      {/* --------- product details data ---------- */}
      <div className="space-y-3">

        <div>
          <DisplayLargeDescriptionText data={product?.description} />

          <p className="flex flex-wrap gap-2 items-center ">
            {product?.tags?.map((tag, index) => (
              <Link href={`/shop?search=${tag}`} key={index} className="text-black font-semibold hover:underline duration-150 text-lg">
                #{tag}{" "}
              </Link>
            ))}
          </p>

        </div>

        {product?.donation_percent > 0 && <div className="flex md:gap-x-8 gap-x-4 items-center">
          <h2 className="w-30">Donation:</h2>
          <p className="text-green-600">{product?.donation_percent}%</p>
        </div>}
        {/* <div className="flex md:gap-x-8 gap-x-4 items-center">
          <h2 className="w-[120px]">Item Number:</h2>
          <p>{productDetails?.item_Number}</p>
        </div> */}
        <div className="flex md:gap-x-8 gap-x-4 items-center">
          <h2 className="w-30">Category :</h2>
          <p>
            <Link href={`/shop?category=${product?.category?.id}`} className="underline duration-150 font-medium text-black underline-offset-1">{product?.category?.name}</Link>
          </p>
        </div>

        <div className="flex md:gap-x-8 gap-x-4 items-center">
          <h2 className="w-30">Condition:</h2>
          <p>{product?.condition}</p>
        </div>
        <div className="flex md:gap-x-8 gap-x-4 items-center">
          <h2 className="w-30">Materials: </h2>
          <p>{product?.materials?.map((material) => material?.material?.name).join(", ")}</p>
        </div>
        <div className="flex md:gap-x-8 gap-x-4 items-center">
          <h2 className="w-30">Brands: </h2>
          <Link href={`/shop?brand=${product?.brand?.id}`} className="hover:underline">{product?.brand?.name}</Link>
        </div>
        {/* available sizes */}
        <div className="flex flex-col md:flex-row justify-between gap-x-2">
          <div className="flex md:gap-x-8 gap-x-4 items-center">
            <h2 className="w-30">Available Size: </h2>
            <Link href={`/shop?size=${product?.size?.id}`} className="hover:underline">{product?.size?.title}</Link>
          </div>
          <Sizechart sizes={product?.sizechart} />
        </div>
        <div className="flex md:gap-x-8 gap-x-4 items-center">
          <h2 className="w-[120px]">Colour: </h2>
          <p>{product?.color}</p>
        </div>
        {/* <div className="flex  md:gap-x-8 gap-x-4 ">
          <h2 className="w-[120px] flex-shrink-0">Care Instruction: </h2>
          <p>{productDetails?.care_Instruction}</p>
        </div> */}
        {/* =============== Shipping & Delivery =============== */}
        {/* <div className="flex md:gap-x-8 gap-x-4 items-center">
          <h2 className="w-[120px] flex-shrink-0 ">Shipping & Delivery:</h2>
          <p>UK Standard Shipping (3–5 working days)</p>
        </div> */}
        {/* =============== Returns Policy =============== */}
        {/* <div className="flex md:gap-x-8 gap-x-4 items-center">
          <h2 className="w-[120px] flex-shrink-0 ">Returns Policy:</h2>
          <p>Returns accepted – {product?.return_window} days </p>
        </div> */}
        {/* ======== alert section ============= */}
        <div className="flex gap-x-2 bg-primary-green/10 px-2 py-1 w-fit rounded">
          <CheckIcon />
          <p className="text-primary-green">
            Your purchase is protected with secure payment processing.
          </p>
        </div>
      </div>

      {/* ======================= all actions buttons ================ */}
      {isStockOut ? <div className="py-3 max-w-lg bg-yellow-700 2xl:w-2/3">
        <p className="text-center text-white">Item Sold Out</p>
      </div> : isDeleted ? <div className="py-3 max-w-lg bg-yellow-700 2xl:w-2/3">
        <p className="text-center text-white">Item not available</p>
      </div> : product?.isMyProduct ? <></> : <ActionButtons product={product}></ActionButtons>}

      {/* ========================= seller details ========================= */}
      <SellerDetails user={product?.user} isMyProfile={product?.isMyProduct} prodId={product?.id}></SellerDetails>
    </div>
  );
};

export default ProductDetails;

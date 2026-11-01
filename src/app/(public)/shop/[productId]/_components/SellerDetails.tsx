"use client";
import { useState, useTransition } from "react";
import CustomAvatar from "@/components/ui/custom-avatar";
import { Rating } from "@/components/ui/rating";
import { userRoleMapper } from "@/utils/userRoleMapper";
import Link from "next/link";
import { IUserWithExtra } from "./ProductDetails/ProductDetails";
import { Button } from "@/components/ui/button";
import { CreateChat } from "@/lib/Actions/Product.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const SellerDetails = ({ user, isMyProfile, prodId }: { user: IUserWithExtra; isMyProfile: boolean, prodId: string }) => {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleContact = async () => {
    setLoading(true);
    try {
      const res = await CreateChat({
        payload: {
          products: [prodId],
          user2Id: user.id,
        },
      });

      if (!res.success || !res?.data?.id) {
        throw new Error(res.message || "Failed to start chat");
      }

      startTransition(() => {
        router.push(`/inbox/${res.data!.id}`);
      });
    } catch (error: any) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast.error(error?.message || "Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting = loading || isPending;

  return (
    <div className=" max-w-lg">

      <hr className="mb-6" />
      <div>
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-x-2 ">
            <div className="flex gap-x-2">
              <div className="flex flex-row gap-x-3">

                <Link
                  href={`/member/${user?.userName}`}
                  className="cursor-pointer"
                >
                  <CustomAvatar image={user?.picture?.url || null} name={user?.userName} className="!size-14"></CustomAvatar>
                </Link>

                <div>
                  <Link
                    href={`/member/${user?.userName}`}
                    className="flex items-center gap-x-2 group cursor-pointer"
                  >
                    <h5 className="font-semibold">{user?.userName}</h5>
                  </Link>
                  <Link
                    href={`/member/${user?.userName}`}
                    className="flex items-center gap-x-2 group cursor-pointer"
                  >
                    <p className="underline underline-offset-1 text-sm">{user?._count?.products} items for sale</p>
                  </Link>

                  <div className="flex items-center gap-x-1">
                    <Rating rating={user?.avgRating} size={16}></Rating>
                    <p className="text-primary-gray md:text-base text-sm">
                      {user?.avgRating} Reviews
                    </p>
                  </div>

                </div>

              </div>
            </div>

            <div
              style={{ backgroundColor: userRoleMapper(user?.auth?.role)?.color }} className="px-2 rounded inline-block">
              <h6 className="text-primary-white text-sm"> {userRoleMapper(user?.auth?.role)?.label}</h6>
            </div>

          </div>


          <div className="flex flex-row gap-x-3 items-center">
            <Link
              href={`/member/${user?.userName}`}
              className="cursor-pointer"
            ><Button variant={"outline"} className="border border-gray-900 cursor-pointer py-4">Visit Shop</Button></Link>

            {isMyProfile ? <></> :
              <Button disabled={isSubmitting} onClick={handleContact} variant={"outline"} className="border border-gray-900 cursor-pointer py-4 min-w-[130px]">
                {isSubmitting ? <div className="w-5 aspect-square rounded-full border-[2px] border-primary-black border-r-gray-400 animate-spin"></div> : "Ask A Question"}
              </Button>
            }
          </div>

        </div>

        <hr className="mt-5" />


      </div>
    </div>
  );
};

export default SellerDetails;

import CustomAvatar from "@/components/shared/CustomAvatar";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { IChatUser, MsgType } from "@/types";
import { defaultImg } from "@/utils/defaultImg";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const UserCard = ({ chat }: { chat: IChatUser }) => {

  const user = useSelector((state: RootState) => state?.auth?.user);

  const pathName = usePathname();

  const friendUser = chat?.user1?.id === user?.id ? chat?.user2 : chat?.user1;

  const active = pathName === `/inbox/${chat?.id}`;

  const unreadCount = chat?._count?.messages || 0;

  const offer = chat?.messages[0]?.offer;
  const isOfferSentMeAsSeller = offer?.sellerId === user?.id;

  const offerStatusMsg = offer ?
    offer?.status === "ACCEPTED" ? (isOfferSentMeAsSeller ? "🏷️Counter offer sent" : "🏷️Offer Accepted") :
      offer?.status === "REJECTED" ? "🏷️Offer Rejected" :
        offer?.status === "PENDING" ? "🏷️Waiting for offer response" : "🏷️Offer cancelled" : "";

  const lastFullMsg = chat?.messages[0];
  const remainingCount = (chat?.items || []).length - 3;

  const isSystemMsg = lastFullMsg?.type === MsgType.SYSTEM || Boolean(lastFullMsg?.SystemMessage);

  const lastmsg =
    isSystemMsg && lastFullMsg?.SystemMessage?.title ? (
      <p className="line-clamp-1 text-sm text-black/60">
        System Message
      </p>
    ) : lastFullMsg?.text ? (
      <p className="line-clamp-1 text-sm text-black/60">{lastFullMsg?.text}</p>
    ) : lastFullMsg?.files?.length > 0 ? (
      <p className="line-clamp-1 text-sm text-black/60">Sent an attachment</p>
    ) : (
      <p className="line-clamp-1 text-sm text-black/60">No messages yet</p>
    );

  return (
    <Link
      href={`/inbox/${chat?.id}`}>
      <div
        className={`flex items-start p-3 py-4 gap-x-3 border-b border-gray-200 hover:bg-zinc-100 duration-150 ${active ? "bg-zinc-100" : ""}`}
      >
        <div>
          {/* <Image src={img} alt={name} className="w-full rounded-full" /> */}
          <CustomAvatar img={friendUser?.picture?.url} name={friendUser?.userName || "Unknown User"} className="md:size-12 size-10" fallbackClass="text-base md:text-base" />
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <p className={cn("text-base font-medium text-black")}>
              {friendUser?.userName}
            </p>
            {<p className={`text-xs px-1.5 py-0.5 rounded-full font-normal text-secondary-2 text-gray-800`}>{moment(chat?.messages[0]?.createdAt).calendar(null, {
              sameDay: "hh:mm A",
              lastDay: "[Yesterday]",
              sameElse: "DD-MM-YYYY",
            })}</p>}

          </div>

          <div className="flex items-center justify-between">

            <div>
              {offer? <p className="text-sm text-black/60">{offerStatusMsg}</p> : lastmsg}

              <div className={cn(
                "flex gap-2 cursor-pointer justify-start"
              )}>
                {chat?.items?.map((item, i) => (
                  <Image
                    src={item?.product?.images[0]?.url || defaultImg?.product}
                    alt={`item-${i}`}
                    key={i}
                    width={500}
                    height={500}
                    placeholder="blur"
                    blurDataURL={defaultImg?.placeholderImg}
                    className="h-10 w-10 rounded object-cover"
                  />
                ))}

                {remainingCount > 0 && (
                  <button
                    // onClick={() => setOpen(true)}
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100"
                  >
                    <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-medium text-white">
                      +{remainingCount}
                    </span>
                  </button>
                )}
              </div>

            </div>

            {unreadCount > 0 && <p className={`text-xs w-5 h-5 flex justify-center items-center rounded-full font-semibold text-secondary-2  bg-primary-black text-white`}>{unreadCount}</p>}

          </div>



        </div>

      </div>
    </Link >
  );
};

export default UserCard;

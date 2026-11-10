import { IMessage } from "@/types";
import moment from "moment";
import React from "react";
import OfferCard from "./OfferCard";
import Image from "next/image";
import { FileText } from "lucide-react";
import Link from "next/link";

const ReceiverMsgCard = ({ msg }: { msg: IMessage }) => {
  return (
    msg?.offer ? <OfferCard offer={msg?.offer} isSent={false} isImSellerForThisOffer={msg?.receiverId === msg?.offer?.sellerId} /> : <div className="rounded-xl border bg-[#DFE1E3] px-3 py-2 space-y-1">
      {msg?.files?.length > 0 && (<div className="flex flex-row gap-2 items-start flex-wrap">
        {msg?.files?.map((file, index) => (
          <Link href={file?.url} target="_blank" key={file?.id}>
            {file?.type === "IMAGE" ? <Image src={file?.url} alt={`file-${index}`} height={200} width={200} className="h-20 w-20 object-cover rounded-md" /> : <div className="flex flex-row gap-2 items-center border border-gray-200 rounded-md max-w-40 bg-white px-2 py-1 gap-x-1">
              <FileText className="size-10" />
              <span className="line-clamp-1 text-xs">{file?.title || file?.url}</span>
            </div>}
          </Link>
        ))}
      </div>)}
      <p className="text-black break-words">{msg?.text}</p>
      <p className="text-[10px] text-left text-gray-700">{moment(msg?.createdAt).format("h:mm a")}</p>
    </div>
  );
};

export default ReceiverMsgCard;
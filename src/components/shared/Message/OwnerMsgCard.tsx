import { IMessage } from "@/types";
import moment from "moment";
import OfferCard from "./OfferCard";
import Link from "next/link";
import Image from "next/image";
import { Check, CheckCheck, FileText } from "lucide-react";

const OwnerMsgCard = ({ msg }: { msg: IMessage }) => {

  return (
    msg?.offer ? <OfferCard offer={msg?.offer} isSent={true} isSeen={msg?.isSeen} isImSellerForThisOffer={msg?.senderId === msg?.offer?.sellerId} /> : <div className="rounded-xl border bg-[#DFE1E3] px-3 py-2 space-y-1">
      {msg?.files?.length > 0 && (<div className="flex flex-row gap-2 items-start">
        {msg?.files?.map((file, index) => (
          <Link href={file?.url} target="_blank" key={file?.id}>
            {file?.type === "IMAGE" ? <Image src={file?.url} alt={`file-${index}`} height={200} width={200} className="h-20 w-20 object-cover rounded-md" /> : <div className="flex flex-row gap-2 items-center border border-gray-200 rounded-md ">
              <FileText />
              <span className="ml-1">{file?.title || file?.url}</span>
            </div>}
          </Link>
        ))}
      </div>)}
      <p>{msg?.text}</p>
      <div className="flex items-center justify-end gap-1 text-[10px] text-gray-700">
        <span>{moment(msg?.createdAt).format("h:mm a")}</span>
        {msg?.isSeen ? (
          <CheckCheck className="size-3.5 text-blue-600" />
        ) : (
          <Check className="size-3.5 text-gray-500" />
        )}
      </div>
    </div>
  );
};

export default OwnerMsgCard;

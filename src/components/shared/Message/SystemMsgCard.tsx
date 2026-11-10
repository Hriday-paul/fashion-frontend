import React from "react";
import moment from "moment";
import { IMessage } from "@/types";

const SystemMsgCard = ({ msg }: { msg: IMessage }) => {
  const systemMsg = msg?.SystemMessage;
  if (!systemMsg) return null;

  return (
    <div className="flex justify-center w-full my-2">
      <div className="max-w-lg w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-2xs space-y-1">
        {systemMsg.title && (
          <p className="text-sm font-semibold text-gray-900 break-words">
            {systemMsg.title}
          </p>
        )}
        {systemMsg.text && (
          <p className="text-xs sm:text-sm text-gray-600 break-words leading-relaxed">
            {systemMsg.text}
          </p>
        )}
        <p className="text-[10px] text-gray-400 pt-0.5">
          {moment(msg?.createdAt).format("h:mm a")}
        </p>
      </div>
    </div>
  );
};

export default SystemMsgCard;


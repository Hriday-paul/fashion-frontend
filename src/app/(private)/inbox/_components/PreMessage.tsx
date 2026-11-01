// PreMessage.tsx
"use client"
import OwnerMsgCard from '@/components/shared/Message/OwnerMsgCard';
import ReceiverMsgCard from '@/components/shared/Message/ReceiverMsgCard';
import { useSocket } from '@/Context/SocketProvider';
import useLazyLoad from '@/hooks/useLazyLoad';
import { useLazyGetMyMessagesQuery } from '@/redux/api/message.api';
import { RootState } from '@/redux/store';
import { IMessage } from '@/types';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';

const formatChatDate = (date: Date | string) => {
    const mDate = moment(date);
    const today = moment();

    if (mDate.isSame(today, "day")) {
        return "Today";
    }

    if (mDate.isSame(today.clone().subtract(1, "day"), "day")) {
        return "Yesterday";
    }

    if (mDate.isAfter(today.clone().subtract(7, "days"))) {
        return mDate.format("dddd"); // Monday, Tuesday, etc.
    }

    return mDate.format("MM/DD/YYYY");
};


function PreMessage({
    chatId,
    scrollToBottom,
    containerRef,
    updatedMsgs,
    isAllPreSeen = false
}: {
    chatId: string;
    scrollToBottom: (behavior?: ScrollBehavior) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    updatedMsgs: IMessage[];
    isAllPreSeen?: boolean;
}) {
    const { socket } = useSocket();
    const [loadProds, { isLoading }] = useLazyGetMyMessagesQuery();
    const triggerRef = useRef(null);

    const isFirstLoad = useRef(true);
    // snapshot taken BEFORE new (older) messages get prepended
    const prevScrollHeight = useRef(0);
    const prevScrollTop = useRef(0);

    const user = useSelector((state: RootState) => state?.auth?.user);

    const loadNextPage = async (page: number) => {
        // capture scroll position right before this page's data lands
        const el = containerRef.current;
        if (el) {
            prevScrollHeight.current = el.scrollHeight;
            prevScrollTop.current = el.scrollTop;
        }

        try {
            const res = await loadProds({ chatId, params: { page, limit: 30 } }).unwrap();
            const raw = res?.data?.data || [];

            // raw is frozen (Immer/RTK Query) -> copy before mutating
            const data = [...raw].reverse();

            const meta = res?.data?.meta;
            const hasMore = meta ? meta.page < meta.totalPage : data.length > 0;
            return { data, hasMore };
        } catch (error) {
            return { data: [], hasMore: false };
        }
    }

    const { data, hasMore } = useLazyLoad<IMessage>({
        triggerRef,
        onGrabData: loadNextPage,
        options: {},
        newDataAppendToEnd: false,
    });

    useEffect(() => {
        if (!data || data.length === 0) return;

        const el = containerRef.current;

        if (isFirstLoad.current) {
            // chat just opened -> jump straight to bottom
            if (el) {
                el.scrollTop = el.scrollHeight;
            } else {
                scrollToBottom("auto");
            }
            isFirstLoad.current = false;
            const latestChatId = data[data.length - 1]?.chatId || chatId;
            if (socket && latestChatId) {
                socket?.emit("seen", { chatId: latestChatId });
            }
            return;
        }

        // subsequent loads (user scrolled up to fetch older messages) ->
        // keep them looking at the SAME message, don't jump to bottom.
        // new content was prepended above, so restore scroll by adding
        // back exactly how much taller the container got.
        if (el) {
            const heightDiff = el.scrollHeight - prevScrollHeight.current;
            el.scrollTop = prevScrollTop.current + heightDiff;
        }
    }, [data, scrollToBottom, containerRef, socket, chatId]);

    return (
        <>

            {
                isLoading && <div className='min-h-40 flex items-center justify-center'>
                    <div className="w-8 aspect-square rounded-full border-[3px] border-white border-r-primary-black animate-spin"></div>
                </div>
            }

            {hasMore && <div ref={triggerRef} style={{ height: 1 }} />}

            {/* Chat Start */}
            {
                !hasMore &&
                < div className="flex justify-center mb-6" >
                    <div className="bg-white px-4 py-2 rounded-full text-sm text-gray-500 flex items-center border border-gray-200">
                        <span>Your chat begins here!</span>
                        <svg
                            className="ml-1 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                </div >
            }

            {
                data?.map((msg, index) => {

                    const isUpdatedMsg = updatedMsgs?.find((msgUp) => msgUp?.id === msg?.id);

                    const baseMessage = isUpdatedMsg ? isUpdatedMsg : msg;
                    const message = isAllPreSeen && !baseMessage?.isSeen ? { ...baseMessage, isSeen: true } : baseMessage;

                    const isMyMessage = message?.senderId?.toString() === user?.id?.toString();

                    const currentDate = moment(message?.createdAt);
                    const prevDate = index > 0 ? moment(data[index - 1]?.createdAt) : null;

                    const showDateSeparator = index === 0 || !currentDate.isSame(prevDate, "day");

                    return <div key={message?.id}>

                        {showDateSeparator && (
                            <div className="flex justify-center items-center text-sm my-8">
                                <p className="text-gray-900 bg-gray-200 px-2 py-0.5 rounded-md text-xs font-normal">
                                    {formatChatDate(message?.createdAt)}
                                </p>
                            </div>
                        )}


                        {!isMyMessage ?
                            <div className="flex items-start gap-x-4">
                                <Image
                                    src={message?.sender?.picture?.url || "/empty-user.png"}
                                    alt="user image"
                                    className="h-10 w-10 object-cover rounded-full"
                                    height={500}
                                    width={500}
                                />
                                <div className="space-y-3 overflow-auto">
                                    <ReceiverMsgCard msg={message} />
                                </div>
                            </div>
                            :
                            <div className="flex flex-row-reverse items-start gap-x-4">
                                <Image
                                    src={message?.sender?.picture?.url || "/empty-user.png"}
                                    alt="user image"
                                    className="h-10 w-10 object-cover rounded-full"
                                    height={500}
                                    width={500}
                                />
                                <div className="flex flex-col items-end space-y-3 overflow-auto">
                                    <OwnerMsgCard msg={message} />
                                </div>
                            </div>}
                    </div>
                })
            }
        </>
    )
}

export default PreMessage

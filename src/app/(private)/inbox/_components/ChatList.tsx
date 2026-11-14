"use client"
import UserCard from '@/components/shared/Message/UserCard'
import React, { useEffect, useState } from 'react'
import { useSocket } from '@/Context/SocketProvider';
import { IChatUser } from '@/types';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import emptyChat from "@/assets/images/chat/empty-chat-icon.png"

function ChatList() {

    const { socket } = useSocket();
    const [chatList, setChatList] = useState<IChatUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const pathName = usePathname();

    useEffect(() => {

        if (!socket) return;

        socket?.on(`chat-list`, (res) => {

            console.log(res)
            setChatList(res);
            setIsLoading(false);
        });

        socket?.on(`io-error`, (res) => {
            console.log("---------------error res---------------", res)
            setIsLoading(false);
            // setIsError(true);
        });


        socket?.emit("my-chat-list", {}, () => {
            // setChatList(response || []);
            setIsLoading(false);
        });


        return () => {

            if (socket) {
                socket.off(`chat-list`);
                socket.off(`my-chat-list`);
                socket.off(`io-error`);
                socket.off("connect");
            }
        };
    }, [socket]);


    return (
        <div className={cn(pathName !== "/inbox" && "hidden lg:block", "h-[calc(100vh-190px)]")}>

            <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Messages</h4>
            </div>

            <div className="mx-auto">

                {/* users list - TODO: Use dynamic data */}
                <div className="scroll-hide h-[calc(100vh-250px)] overflow-auto">

                    {
                        isLoading && <div className='min-h-40 flex items-center justify-center'>
                            <div className="w-8 aspect-square rounded-full border-[3px] border-gray-200 border-r-primary-black animate-spin"></div>
                        </div>
                    }

                    {chatList.map((chat, idx) => (
                        <UserCard
                            key={chat?.id}
                            chat={chat}
                        />
                    ))}

                    {/* //empty state */}
                    {!isLoading && chatList.length === 0 && <div className='h-full flex flex-col items-center justify-center px-10'>
                        <Image src={emptyChat} alt="Empty chat" className='h-10 w-auto' />
                        <p className='text-gray-900 text-lg font-medium my-2'>No conversations yet</p>
                        <p className='text-gray-600 text-sm text-center'>Your messages with other FASHI-ON members will appear here.</p>
                    </div>}

                </div>
            </div>
        </div>
    )
}

export default ChatList
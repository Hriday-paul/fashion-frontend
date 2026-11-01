import React, { useEffect, useState } from 'react'
import OwnerMsgCard from '@/components/shared/Message/OwnerMsgCard';
import ReceiverMsgCard from '@/components/shared/Message/ReceiverMsgCard';
import { useSocket } from '@/Context/SocketProvider';
import { RootState } from '@/redux/store';
import { IMessage } from '@/types';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

function NewMessages({
    chatId,
    scrollToBottom,
    setUpdatedMsgs,
    updatedMsgs,
    setIsAllPreSeen
}: {
    chatId: string;
    scrollToBottom: () => void;
    setUpdatedMsgs: React.Dispatch<React.SetStateAction<IMessage[]>>;
    updatedMsgs: IMessage[];
    setIsAllPreSeen: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const { socket } = useSocket();
    const user = useSelector((state: RootState) => state?.auth?.user);

    const [newMessages, setNewMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        setNewMessages([]);

        if (!socket) return;

        socket.emit(`join-chat`, { chatId }, (res: any) => {
            console.log(res);
            socket?.emit(`seen`, { chatId });
        });

        // receive my sent message & receive
        socket.on(`new-message`, (res: IMessage) => {
            setNewMessages((prev) => [...prev, res]);
            if (res?.senderId?.toString() !== user?.id?.toString()) {
                socket?.emit(`seen`, { chatId: res?.chatId || chatId });
            }
        });

        socket.on(`update-message`, (res: IMessage) => {
            setUpdatedMsgs((prev) => [...prev.filter((m) => m.id !== res.id), res]);
        });

        // seen msg
        socket.on(`seen-message`, () => {
            // mark all messages as seen
            setNewMessages((prev) => prev.map((msg) => ({ ...msg, isSeen: true })));
            setUpdatedMsgs((prev) => prev.map((msg) => ({ ...msg, isSeen: true })));
            setIsAllPreSeen(true);
        });

        socket?.on(`io-error`, (res) => {
            console.log("---------------error res---------------", res)
            toast.error("An error occured, refresh the page")
            // setIsError(true);
        });

        return () => {
            if (socket) {
                socket.off(`seen-message`);
                socket.off(`new-message`);
                socket.off(`update-message`);
            }
        };

    }, [socket, chatId, user, setUpdatedMsgs, setIsAllPreSeen]);

    useEffect(() => {
        scrollToBottom();
    }, [newMessages]);

    return (
        <>

            {newMessages?.length > 0 && <div className="flex justify-center items-center text-sm my-8">
                <p className="text-gray-900 bg-gray-200 px-2 py-0.5 rounded-md text-xs font-normal">
                    Latest messages
                </p>
            </div>}

            {
                newMessages?.map((msg, index) => {

                    const isUpdatedMsg = updatedMsgs?.find((msgUp) => msgUp?.id === msg?.id);

                    const message = isUpdatedMsg ? isUpdatedMsg : msg;

                    const isMyMessage = message?.senderId?.toString() === user?.id?.toString();

                    return <div key={message?.id}>

                        {!isMyMessage ?
                            // received message
                            <div className="flex items-start gap-x-4" >
                                <Image
                                    src={message?.sender?.picture?.url || "/empty-user.png"}
                                    alt="user image"
                                    className="h-10 w-10 object-cover rounded-full"
                                    height={500}
                                    width={500}
                                />
                                <div className="max-w-[50%] space-y-3 overflow-hidden">

                                    <ReceiverMsgCard msg={message} />
                                </div>
                            </div>

                            :

                            // sent message
                            <div className="flex flex-row-reverse items-start gap-x-4">
                                <Image
                                    src={message?.sender?.picture?.url || "/empty-user.png"}
                                    alt="user image"
                                    className="h-10 w-10 object-cover rounded-full"
                                    height={500}
                                    width={500}
                                />
                                <div className="flex max-w-[50%] flex-col items-end space-y-3">
                                    <OwnerMsgCard msg={message} />
                                </div>
                            </div>}
                    </div>
                })
            }
        </>
    )
}

export default NewMessages

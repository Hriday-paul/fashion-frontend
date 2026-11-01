"use client"
import PreMessage from './PreMessage';
import NewMessages from './NewMessages';
import { useEffect, useRef, useState } from 'react';
import { IMessage } from '@/types';

function MessageBox({ chatId }: { chatId: string }) {
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [updatedMsgs, setUpdatedMsgs] = useState<IMessage[]>([]);
    const [isAllPreSeen, setIsAllPreSeen] = useState(false);

    useEffect(() => {
        setUpdatedMsgs([]);
        setIsAllPreSeen(false);
    }, [chatId]);

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior, block: "end" });
        }
    };

    return (
        <div ref={chatContainerRef} className="overflow-y-auto h-full space-y-6 px-5 pt-5 bg-zinc-50">
            {chatId && (
                <PreMessage
                    chatId={chatId}
                    scrollToBottom={scrollToBottom}
                    containerRef={chatContainerRef}
                    updatedMsgs={updatedMsgs}
                    isAllPreSeen={isAllPreSeen}
                />
            )}
            <NewMessages
                chatId={chatId}
                scrollToBottom={scrollToBottom}
                setUpdatedMsgs={setUpdatedMsgs}
                updatedMsgs={updatedMsgs}
                setIsAllPreSeen={setIsAllPreSeen}
            />
            <div ref={bottomRef}></div>
        </div>
    )
}

export default MessageBox

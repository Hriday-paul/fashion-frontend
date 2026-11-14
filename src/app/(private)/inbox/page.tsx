"use client"
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react'
import emptyChat from "@/assets/images/chat/empty-chat-icon.png"
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserRole } from '@/types';

function InboxPage() {
    const pathName = usePathname();

    const cUser = useSelector((state: RootState) => state?.auth?.user);

    const allowMessageTxt = cUser?.auth ? (cUser?.auth?.role == UserRole.CHARITABLE_ORGANIZATION || cUser?.auth?.role == UserRole.CHARITY_SHOP || cUser?.auth?.role == UserRole.ECO_FRIENDLY_STORE) : false;

    return (
        <div className={cn(pathName === "/inbox" && "hidden lg:flex flex-col h-full items-center justify-center")}>
            <div className='h-full flex flex-col items-center justify-center max-w-md mx-auto text-center'>
                <Image src={emptyChat} alt="Empty chat" className='h-12 lg:h-16 w-auto' />
                <p className='text-gray-900 text-2xl font-semibold my-3'>Welcome to FASHI-ON Messages</p>
                <p className='text-amber-500 text-xl font-medium text-center mb-2'>Start a conversation with other FASHI-ON members.</p>

                {!allowMessageTxt && <p className='text-gray-600 text-base text-center'>Use Messages to ask about items, discuss purchases or sales, arrange donations & stay connected.</p>}

            </div>
        </div>
    )
}

export default InboxPage
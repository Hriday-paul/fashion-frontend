"use client"
import { Button } from '@/components/ui/button'
import { FolowMemeber, UnFolowMemeber } from '@/lib/Actions/Folow.action';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import React from 'react'
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function FolowUnFolow({ isFolow, memberId, className }: { isFolow: boolean, memberId: string, className?: string }) {

    const handleFolow = async () => {
        try {
            const res = await FolowMemeber({ payload: { memberId } });
            if (!res.success) {
                throw new Error(res.message);
            }
        }
        catch (error: any) {
            if (isRedirectError(error)) {
                throw error; // Let Next.js handle the redirect
            }
            toast.error(error?.message);
        }
    }

    const handleUnFolow = async () => {
        try {
            const res = await UnFolowMemeber({ payload: { memberId } });
            if (!res.success) {
                throw new Error(res.message);
            }
        }
        catch (error: any) {
            if (isRedirectError(error)) {
                throw error; // Let Next.js handle the redirect
            }
            toast.error(error?.message);
        }
    }

    return (
        <>
            {
                isFolow ? <Button variant={'outline'} onClick={handleUnFolow} className={cn("font-semibold px-6 cursor-pointer rounded-none w-full sm:w-auto", className)}>
                    Following
                </Button> : <Button onClick={handleFolow} className={cn("text-white font-semibold px-6 cursor-pointer rounded-none w-full sm:w-auto", className)}>
                    Follow
                </Button>
            }
        </>
    )
}

export default FolowUnFolow
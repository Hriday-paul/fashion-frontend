import FormatCurrency from "@/components/shared/FormatCurrency";
import { getBadgeVariant } from '@/components/shared/Modal/Charity/otherUserDonation/data.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Empty from '@/components/ui/empty';
import { GetMemberSellDonations } from '@/lib/services/Donation'
import { ISelldonation } from '@/types';
import { defaultImg } from '@/utils/defaultImg';
import { LoaderCircle } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import React, { Suspense } from 'react'

async function SoldDonations({ username }: { username: string }) {

  const sellDonationPromise = GetMemberSellDonations({ username })

  return (
    <div>
      <Suspense fallback={<div className='min-h-40 flex items-center justify-center'>
        <LoaderCircle size={40} className="text-4xl text-main-color animate-spin" />
      </div>}>
        <SellDonationlist sellPromise={sellDonationPromise} />
      </Suspense>
    </div>
  )
}

export default SoldDonations;

const SellDonationlist = async ({ sellPromise }: { sellPromise: Promise<{ data: ISelldonation[] }> }) => {
  const result = await sellPromise;

  return <div className="space-y-4 pr-2">
    {result?.data.map((campaign) => (
      <div
        key={campaign?.id}
        className="flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {campaign?.isAnonymous ? <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback>?</AvatarFallback>
          </Avatar> : <Link href={`/member/${campaign?.charity?.userName}`} className="flex items-center gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage
                src={campaign?.charity?.picture?.url}
                alt={campaign?.charity?.fname}
              />
              <AvatarFallback>
                {campaign?.charity?.fname.charAt(0)}
              </AvatarFallback>
            </Avatar>

          </Link>}

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {campaign?.isAnonymous ? "Anonymous" : <Link href={`/member/${campaign?.charity?.userName}`} className="text-gray-900 hover:underline underline-offset-1">
                {campaign?.charity?.fname} {campaign?.charity?.lname}
              </Link>}
            </p>
            <p className="text-xs text-muted-foreground">
              <FormatCurrency fixed amount={campaign?.amount} decimals={0} /> • {moment(campaign?.createdAt).fromNow()} •{" "}
              {campaign?.orderItem?.product?.category?.name}
            </p>
          </div>
        </div>
        <Badge
          variant={getBadgeVariant("Item sold")}
          className={"bg-blue-100 text-blue-700 hover:bg-blue-100"}
        >
          Item sold
        </Badge>
      </div>
    ))}
    {
      result?.data?.length <= 0 && <Empty message='No sell donations yet.' />
    }
  </div>
}
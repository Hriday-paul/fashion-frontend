import { EnableBundleCreation } from '@/components/shared/UserProfile/CreateBundle/EnableBundleCreation'
import { GetBundleDiscounts } from '@/lib/services/UserDetails';
import React from 'react'

import bundleImg from '@/assets/images/placeholder/bundle.jpg'
import Image from 'next/image';

async function BundleDiscount() {

    const discounts = await GetBundleDiscounts() as { data: { enabled: boolean, tiers: { itemCount: number, discountPercent: number }[] } };

    return (
        <div>
            <EnableBundleCreation discounts={discounts.data} />
            <Image src={bundleImg} alt="Bundle" className="w-full lg:w-1/2 mx-auto h-auto" />
        </div>
    )
}

export default BundleDiscount
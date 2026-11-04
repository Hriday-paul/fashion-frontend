"use client"
import BillingAddressModal from '@/app/(public)/checkout/cart/[cartGroupId]/_components/Billing/BillingAddressModal';
import { updateSellingDetails } from '@/lib/Actions/Cart.action';
import { useSellCountriesQuery } from '@/redux/api/userApi';
import { IBillingDetails } from '@/types';
import React, { useState } from 'react'

function UpdateSellingAddress({ defaultdata, actionBtn, className }: { defaultdata: IBillingDetails | null, actionBtn: React.ReactNode, className?: string }) {
    const [showEditAddress, setShowEditAddress] = useState<boolean>(false);
    const { data: sellCountriesRes } = useSellCountriesQuery();

    const allowedCountries = sellCountriesRes?.data?.map((country) => country.code);

    const updateAddressFn = async (data: any) => {
        const res = await updateSellingDetails(data);
        if (!res.success) {
            throw new Error(res.message);
        }
    }

    return (
        <div>

            <button type="button" className={className} onClick={() => setShowEditAddress(true)}>
                {actionBtn}
            </button>

            <BillingAddressModal
                open={showEditAddress}
                onOpenChange={setShowEditAddress}
                defaultValue={defaultdata}
                title='Selling Address'
                updateAddressFn={updateAddressFn}
                allowedCountries={allowedCountries}
            />
        </div>
    )
}
export default UpdateSellingAddress

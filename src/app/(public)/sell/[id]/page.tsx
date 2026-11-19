import GetProductDetails from '@/lib/services/ProductDetails';
import React from 'react'
import { IProductWithUser } from '../../shop/[productId]/_components/ProductDetails/ProductDetails';
import { notFound, redirect } from 'next/navigation';
import { GetMyProfile } from '@/lib/services/UserDetails';
import { IUser, UserRole } from '@/types';
import Container from '@/components/shared/Container';
import EditlistingForm from './_components/EditlistingForm';

export const metadata = {
    title: "Edit Sell Item",
    description: "Edit your sell item with Fashion!",
}

async function EditSalePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Charity accounts cannot sell or edit listings, even via a direct link.
    const profile = await GetMyProfile() as { data: IUser };
    if (profile?.data?.auth?.role === UserRole.CHARITABLE_ORGANIZATION) {
        redirect("/profile");
    }

    const detail = await GetProductDetails({ id }) as { data: IProductWithUser };

    if (!detail?.data) {
        return notFound();
    }

    return (
        <Container>
            <EditlistingForm product={detail?.data} />
        </Container>
    )
}

export default EditSalePage
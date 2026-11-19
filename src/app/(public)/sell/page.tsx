import Container from "@/components/shared/Container";
import AddProductForm from "@/components/shared/UserProfile/AddProduct/AddProductForm";
import { GetMyProfile } from "@/lib/services/UserDetails";
import { IUser, UserRole } from "@/types";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Sell Products",
  description: "Sell your products with Fashion!",
}

export default async function SellProductPage() {
  const profile = await GetMyProfile() as { data: IUser };

  // Charity accounts cannot sell, even via a direct link.
  if (profile?.data?.auth?.role === UserRole.CHARITABLE_ORGANIZATION) {
    redirect("/profile");
  }

  return (
    <Container>
      <AddProductForm />
    </Container>
  );
}

import React from "react";
import Container from "@/components/shared/Container";
import AssistedSellerHelpContainer from "./_components/AssistedSellerHelpContainer";

export const metadata = {
  title: "Assisted Seller Guide | FASHI-ON Help Center",
  description:
    "Learn how FASHI-ON Assisted Selling works, from submitting your request and shipping items to authentication, 30% commission, and item returns.",
};

export default function AssistedSellerHelpPage() {
  return (
    <Container className="py-6 md:py-10">
      <AssistedSellerHelpContainer />
    </Container>
  );
}


import React from "react";
import Container from "@/components/shared/Container";
import DonationsHelpContainer from "./_components/DonationsHelpContainer";

export const metadata = {
  title: "Charity Donations Guide | FASHI-ON Help Center",
  description:
    "Learn how FASHI-ON charity donations work, including the minimum 5% adjustable seller donation, multi-charity splitting, donation privacy, and when funds are released to charity.",
};

export default function DonationsHelpPage() {
  return (
    <Container className="py-6 md:py-10">
      <DonationsHelpContainer />
    </Container>
  );
}


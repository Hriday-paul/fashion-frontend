"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserRole } from "@/types";
import Container from "../Container";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CharityDonationFormDialog } from "../Modal/Charity/CharityDonationFormDialog";

const quickLink = [
  {
    label: "Sing In",
    href: "/sign-in",
    prefetch: true,
  },
  {
    label: "Sing Up",
    href: "/sign-up",
    prefetch: true,
  },
  {
    label: "Sell Now",
    href: "/sell",
    prefetch: false,
  },
];

const TopInfo = () => {
  const role = useSelector((state: RootState) => state.auth.user?.auth?.role);
  const links = quickLink.filter(
    (link) => !(link.href === "/sell" && role === UserRole.CHARITABLE_ORGANIZATION)
  );

  return (
    <header className="bg-primary-black text-primary-white py-2  hidden md:block">
      <Container className="flex justify-between items-center text-sm gap-x-2 ">
        <div className="xl:space-x-8 space-x-4  text-center w-full md:w-fit lg:text-base md:text-xs ">
          {/* <Link href={"tel:+ 123 (456) 789-987"} className="truncate">+ 123 (456) 789-987</Link>
          <Link href={"mailto:contact@fashion.com"} className="truncate">contact@fashion.com</Link> */}
        </div>

        <div className="xl:space-x-4 space-x-1 hidden md:block lg:text-base md:text-xs">
          <CharityDonationFormDialog />
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              prefetch={link.prefetch}
              className={cn(
                "uppercase",
                link.label === "Donate now" && "text-green-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </header>
  );
};

export default TopInfo;

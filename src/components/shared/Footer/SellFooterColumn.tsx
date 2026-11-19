"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserRole } from "@/types";
import { FooterColumn } from "./FooterColumn";

type FooterLink = { name: string; link: string; id: number; prefetch?: boolean };

// Selling links are hidden for Charity accounts (CHARITABLE_ORGANIZATION).
const SELLING_LINKS = ["/sell", "/assisted-seller"];

export default function SellFooterColumn({ links }: { links: FooterLink[] }) {
  const role = useSelector((state: RootState) => state.auth.user?.auth?.role);
  const visible =
    role === UserRole.CHARITABLE_ORGANIZATION
      ? links.filter((l) => !SELLING_LINKS.includes(l.link))
      : links;

  return <FooterColumn title="Sell" links={visible} />;
}

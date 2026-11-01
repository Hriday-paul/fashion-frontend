"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ChevronRight,
  HandCoins,
  Handshake,
  Info,
  LayoutDashboard,
  LifeBuoy,
  List,
  LogOut,
  Package,
  Settings,
  Shirt,
  SquareChartGantt,
  Tags,
  UserRound,
  UserRoundCog,
  Wallet,
} from "lucide-react";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProfileNavIcon } from "@/icons";
import { CharityDonationFormDialog } from "../../Modal/Charity/CharityDonationFormDialog";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

type NavLink = {
  icon: React.ReactNode;
  name: string;
  link: string;
  label?: React.ReactNode; // optional custom label (e.g. with a tooltip)
  roles?: UserRole[];
};

// Reusable role groups
const SELLER_ROLES = [
  UserRole.INDIVIDUAL_USER,
  UserRole.CHARITY_SHOP,
  UserRole.ECO_FRIENDLY_STORE,
  UserRole.CELEBRITY,
  UserRole.AMBASSADOR,
  UserRole.PROFESSIONAL_SELLER,
];

const itemClass =
  "cursor-pointer group rounded-none border-b border-gray-200 py-3";

function AssistedSellerLabel() {
  return (
    <span className="flex items-center gap-1.5">
      Assisted Seller
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="inline-flex cursor-help"
              // Stop the surrounding <Link> / menu item from reacting to clicks on the icon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Info className="size-4 text-muted-foreground" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs rounded-none py-4" side="bottom">
            <p className="text-base font-semibold mb-2">What is Assisted Selling?</p>
            <p className="text-sm text-zinc-200">
              Send your items to Fashi-ON and we’ll photograph, list and manage them for you. Your items will appear in your account so you can monitor their progress, sales and earnings, but Fashi-ON-managed listings cannot be edited by you.
            </p>
            <Link href="/help/assisted-seller" className="text-sm text-blue-600 underline mt-2 block">
              Learn more
            </Link>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
}

export default function ProfileIcon() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.refresh();
    dispatch(baseApi.util.resetApiState());
    router.refresh();
  };

  const navLinks: NavLink[] = [
    {
      icon: <LayoutDashboard className="size-5" />,
      name: "Dashboard",
      link: `/profile`,
    },
    {
      icon: <UserRound className="size-5" />,
      name: "View Profile",
      link: `/member/${user?.userName}`,
    },
    {
      icon: <UserRoundCog className="size-5" />,
      name: "Edit Profile",
      link: "/profile/edit",
    },
    {
      icon: <HandCoins className="size-5" />,
      name: "Monetory Donations",
      link: "/profile/donation",
      roles: [UserRole.CHARITABLE_ORGANIZATION, UserRole.CHARITY_SHOP],
    },
    {
      icon: <Shirt className="size-5" />,
      name: "Cloth Donations",
      link: "/profile/donation/cloth",
      roles: [UserRole.CHARITY_SHOP],
    },
    {
      icon: <SquareChartGantt className="size-5" />,
      name: "List an item",
      link: "/sell",
      roles: SELLER_ROLES,
    },
    {
      icon: <List className="size-5" />,
      name: "Products-Listing",
      link: "/profile/sell/products",
      roles: SELLER_ROLES,
    },
    {
      icon: <Package className="size-5" />,
      name: "My Orders",
      link: "/profile/purchase/orders",
      roles: SELLER_ROLES,
    },
    {
      icon: <Settings className="size-5" />,
      name: "Settings",
      link: "/profile",
    },
    {
      icon: <Handshake className="size-5" />,
      name: "Assisted Seller",
      label: <AssistedSellerLabel />,
      link: "/assisted-seller",
      roles: SELLER_ROLES,
    },
    {
      icon: <Tags className="size-5" />,
      name: "Badges",
      link: "/profile/badges",
    },
    {
      icon: <Wallet className="size-5" />,
      name: "Earnings & Wallet",
      link: "/profile/earnings",
    },
  ];

  const activeNavLinks = navLinks.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.auth?.role);
  });

  const isCharity = [UserRole.CHARITY_SHOP, UserRole.CHARITABLE_ORGANIZATION].includes(user?.auth?.role);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className={cn("cursor-pointer relative focus-within:outline-none focus-within:ring-0 focus-within:ring-primary-black p-1.5 md:flex hidden", open && "bg-gray-100 rounded-md")}>
        <ProfileNavIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="md:min-w-xs overflow-y-auto max-h-96 p-0 rounded-none"
      >
        {activeNavLinks.map((item) => (
          <Link href={item.link} key={item.name} onClick={closeMenu}>
            <DropdownMenuItem className={itemClass}>
              <div className="flex h-6 w-6 items-center justify-center text-muted-foreground">
                {item.icon}
              </div>

              <div className="text-base">{item.label ?? item.name}</div>
              <DropdownMenuShortcut>
                <ChevronRight className="group-hover:translate-x-2 transition-all duration-300" />
              </DropdownMenuShortcut>

            </DropdownMenuItem>
          </Link>
        ))}

        {/* Donate */}
        {!isCharity && <CharityDonationFormDialog>
          <div className="px-1.5 hover:bg-zinc-100">
            <div className="flex items-center gap-x-3 pl-1 cursor-pointer py-3">
              <LifeBuoy className="flex size-5 items-center justify-center text-muted-foreground" />
              Donate Now
            </div>
            <DropdownMenuSeparator />
          </div>
        </CharityDonationFormDialog>}

        {/* Logout */}
        <DropdownMenuItem onClick={handleLogout} className={itemClass}>
          <div className="flex items-center gap-x-2 pl-1">
            <LogOut className="size-5" />
            <p className="text-base">Logout</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
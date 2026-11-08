"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ChevronRight, HandCoins, Handshake, Heart, LayoutDashboard, List, LogOut, Mail, MapPin, Moon, Package, PackageOpen, Settings, Shirt, SquareChartGantt, Tags, UserRoundCog, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CharityDonationFormDialog } from "../../Modal/Charity/CharityDonationFormDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CartIcon } from "@/icons";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import { UserRole } from "@/types";

// Reusable role groups
const SELLER_ROLES = [
  UserRole.INDIVIDUAL_USER,
  UserRole.CHARITY_SHOP,
  UserRole.ECO_FRIENDLY_STORE,
  UserRole.CELEBRITY,
  UserRole.AMBASSADOR,
  UserRole.PROFESSIONAL_SELLER,
];

type NavLink = {
  icon: React.ReactNode;
  name: string;
  link: string;
  roles?: UserRole[];
}

const navLinksFotProfileIcon: NavLink[] = [
  {
    icon: <LayoutDashboard className="size-5" />,
    name: "Dashboard",
    link: "/profile",
  },
  {
    icon: <UserRoundCog className="size-5" />,
    name: "Edit Profile",
    link: "/profile/edit",
  },
  {
    icon: <CartIcon className="size-5" />,
    name: "Shop",
    link: "/shop",
    roles: SELLER_ROLES,
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
    icon: <HandCoins className="size-5" />,
    name: "Monetory Donation",
    link: "/profile/donation",
    roles: [UserRole.CHARITABLE_ORGANIZATION, UserRole.CHARITY_SHOP],
  },
  {
    icon: <Shirt className="size-5" />,
    name: "Cloth Donation",
    link: "/profile/donation/cloth",
    roles: [UserRole.CHARITY_SHOP],
  },
  {
    icon: <Handshake className="size-5" />,
    name: "Monetory Contribution",
    link: "/profile/donation-contribution",
    roles: SELLER_ROLES.filter(
      (role) => role !== UserRole.CHARITY_SHOP
    ),
  },
  {
    icon: <Shirt className="size-5" />,
    name: "Cloth Donation",
    link: "/profile/donation-contribution/cloth-donation",
    roles: SELLER_ROLES.filter(
      (role) => role !== UserRole.CHARITY_SHOP
    ),
  },
  {
    icon: <Heart className="size-5" />,
    name: "Favorites",
    link: "/wishlist",
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
  {
    icon: <Bell className="size-5" />,
    name: "Notifications",
    link: "/notifications",
  },
  {
    icon: <Mail className="size-5" />,
    name: "Message",
    link: "/inbox",
    roles: SELLER_ROLES,
  },
  {
    icon: <Moon className="size-5" />,
    name: "Vacation mode",
    link: "/profile/vacation-mode",
    roles: SELLER_ROLES,
  },
  {
    icon: <PackageOpen className="size-5" />,
    name: "Bundle Offers",
    link: "/profile/sell/bundle-discount",
    roles: SELLER_ROLES,
  },
  // {
  //   icon: <LogOut className="size-5" />,
  //   label: "Sign Out",
  //   link: "/sign-in",
  // },
];

export function SheetContentContainer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {

  const user = useSelector((state: RootState) => state.auth.user);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.refresh();
    dispatch(baseApi.util.resetApiState());
    router.refresh();
  };

  const activeNavLinks = navLinksFotProfileIcon.filter((item) => {
    if (!item.roles) return true;
    const role = user?.auth?.role;
    if (!role) return false;
    return item.roles.includes(role);
  });

  const isCharityShop = user?.auth?.role === UserRole.CHARITY_SHOP;
  const isCharityOrg = user?.auth?.role === UserRole.CHARITABLE_ORGANIZATION;

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto scroll-hide">
      {/* Header Section */}
      <div className="border-b mt-3">
        <Link href={`/member/${user?.userName}`} onClick={() => setOpen(false)} className="cursor-pointer">
          <div className="flex items-center justify-between hover:bg-zinc-50 px-4 py-2">
            <div className="space-x-2 flex items-center ">
              {/* <Avatar className="h-12 w-12">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar> */}
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{user?.userName}</span>
                <span className="text-xs text-muted-foreground">View Profile</span>
              </div>
            </div>
            <div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </div>
        </Link>
      </div>

      {/* Featured Section */}
      {!isCharityOrg && <div className="border-b p-4">
        <Card className="overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-orange-950/20 dark:to-amber-950/20">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 p-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Sell an item</h3>
                <p className="text-xs text-muted-foreground">
                  {isCharityShop ? "(Earn money from sales)" : "(Earn money and donate to charity)"}
                </p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src="/userRoleImage3.png"
                    alt="Sell items"
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute bottom-8 right-8 h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src="/recently_viewed_image4.png"
                    alt="Sell items"
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="bg-black px-4 py-2 text-center">
              <Link
                href={"/sell"}
                onClick={() => setOpen(false)}
                prefetch={false}
                className="flex items-center justify-center gap-2 group"
              >
                <span className="text-sm font-medium text-white">Sell Now</span>
                <ChevronRight className="h-4 w-4 text-white group-hover:translate-x-2 duration-500" />
              </Link>
            </div>
            {!isCharityShop && <CharityDonationFormDialog>
              <Button
                className="w-full rounded-none bg-white text-black hover:bg-gray-100 group cursor-pointer"
                size="sm"
              >
                Donate Now{" "}
                <ChevronRight className="h-4 w-4  group-hover:translate-x-2 duration-500" />
              </Button>
            </CharityDonationFormDialog>}
          </CardContent>
        </Card>
      </div>}

      {/* Navigation List */}
      <div className="flex-1 ">
        <nav className="py-2">
          {activeNavLinks.map((item, index) => (
            <Link href={item.link || "#"} key={index} onClick={() => setOpen(false)} className="cursor-pointer">

              <button
                key={index}

                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                  "group"
                )}
              >
                <div className="flex h-5 w-5 items-center justify-center text-muted-foreground">
                  {item.icon}
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {item.name}
                </span>

                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />

              </button>

            </Link>
          ))}
        </nav>
      </div>

      <Button variant="destructive" className="rounded-none m-2 mt-0" onClick={handleLogout}>Logout</Button>
    </div>
  );
}

"use client";
import Link from "next/link";
import Container from "../Container";
import logo from "@/assets/images/common-image/logo.png";
import Image from "next/image";
import SmallDeviceView from "./SmallDeviceView";
import SearchAndNavIcon from "./SearchAndNavIcon";
import GlobalItemAndMemberSearch from "./GlobalItemAndMemberSearch";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { CharityDonationFormDialog } from "../Modal/Charity/CharityDonationFormDialog";


const NavLogoCategory = () => {

  const user = useSelector((state: RootState) => state.auth.user);

  const isCharity = user?.auth?.role === UserRole.CHARITY_SHOP || user?.auth?.role === UserRole.CHARITABLE_ORGANIZATION;

  const isCharityOrg = user?.auth?.role === UserRole.CHARITABLE_ORGANIZATION;

  return (
    <div className="bg-primary-white">
      <Container className="flex flex-row-reverse md:flex-row justify-between items-center gap-x-5 lg:gap-x-10 xl:gap-x-16  py-4">

        {/* ======= Small Screen view ========== */}
        {user ? <div className="flex items-center gap-x-2">
          <div className="md:hidden ">
            <SearchAndNavIcon />
          </div>
          <SmallDeviceView />
        </div> : <div className="md:hidden flex items-center gap-x-4">

          <Link href={"/sign-up"}>
            <p className="font-medium">Sign Up</p>
          </Link>

          <Link href={"/sign-in"}>
            <Button className="font-medium rounded-none" size={"sm"}>
              Sign In
            </Button>
          </Link>

        </div>}

        {/* ======= logo ========== */}
        <div className="flex justify-start items-center w-auto">
          <Link href={"/"}>
            <Image src={logo} alt="logo" className="w-32 md:w-36 lg:w-w-40 xl:w-44 h-auto"></Image>
          </Link>
        </div>


        <div className="relative hidden lg:block flex-1">
          <GlobalItemAndMemberSearch />
        </div>


        {/* ======= search and nav icon  ========== */}
        {user ? <div className="md:block hidden ">
          <div className="flex flex-row gap-x-4 items-center">

            {!isCharity && <CharityDonationFormDialog>
              <Button variant={"default"} className="rounded-none cursor-pointer bg-green-800 hover:bg-green-900 text-white">
                Donate Now
              </Button>
            </CharityDonationFormDialog>}

            {!isCharityOrg && <Link href={"/sell"} prefetch={false}>
              <Button variant={"default"} className="rounded-none cursor-pointer">
                Sell An Item
              </Button>
            </Link>}

            <SearchAndNavIcon></SearchAndNavIcon>
          </div>
        </div> : <div className="flex-row gap-x-4 items-center hidden md:flex">

          {!isCharity && <CharityDonationFormDialog>
            <Button variant={"default"} className="rounded-none cursor-pointer bg-green-800 hover:bg-green-900 text-white">
              Donate Now
            </Button>
          </CharityDonationFormDialog>}

          <Link href={"/sell"} prefetch={false}>
            <Button variant={"default"} className="rounded-none cursor-pointer">
              Sell An Item
            </Button>
          </Link>

          <Link href={"/sign-in"}>
            <p className="font-medium">
              Sign In
            </p>
          </Link>

          <Link href={"/sign-up"}>
            <p className="font-medium">Sign Up</p>
          </Link>

        </div>}



      </Container>
    </div>
  );
};

export default NavLogoCategory;

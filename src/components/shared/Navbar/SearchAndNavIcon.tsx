"use client"
import ProfileIcon from "./NavIconsWithDropDown/ProfileIcon";
import NotificationIcon from "./NavIconsWithDropDown/NotificationIcon";
import WishListDropDown from "./NavIconsWithDropDown/WishListDropDown";
import CartDropDown from "./NavIconsWithDropDown/CartDropDown";
import MessageDropDown from "./NavIconsWithDropDown/MessageDropDown";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserRole } from "@/types";

const SELLER_ROLES = [
  UserRole.INDIVIDUAL_USER,
  UserRole.CELEBRITY,
  UserRole.AMBASSADOR,
  UserRole.PROFESSIONAL_SELLER,
];

const SearchAndNavIcon = () => {

  const user = useSelector((state: RootState) => state?.auth?.user);

  const haveAccessCart = user?.auth?.role ? SELLER_ROLES.includes(user?.auth?.role) : false;

  return (
    <div className="flex flex-row items-center gap-x-1">

      <div className="mr-2">
        <MessageDropDown />
      </div>

      {<WishListDropDown />}


      <NotificationIcon />


      {haveAccessCart && <CartDropDown />}


      <ProfileIcon />

    </div>

  );
};

export default SearchAndNavIcon;

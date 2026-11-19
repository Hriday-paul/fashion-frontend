import { NextResponse } from "next/server";
import { authRoutes } from "./lib/authRoutes";
import { jwtDecode } from "jwt-decode";
import { UserRole } from "./types";
import type { NextRequest } from "next/server";
import { getRoutesByRole, SELLER_ROLES } from "./lib/profileRoutes";

const isPathMatched = (pathname: string, route: string) => pathname === route || pathname.startsWith(`${route}/`);

const sellerRoutes: { route: string, role: UserRole[] }[] = [
  { route: "/sell", role: SELLER_ROLES },
  { route: "/favourites", role: SELLER_ROLES },
  { route: "/notifications", role: [UserRole.CHARITABLE_ORGANIZATION, ...SELLER_ROLES] },
  { route: "/inbox", role: SELLER_ROLES },
  {
    route: "/checkout", role: SELLER_ROLES.filter(
      (role) => (role !== UserRole.ECO_FRIENDLY_STORE && role !== UserRole.CHARITY_SHOP))
  },
  {
    route: "/shopping-cart", role: SELLER_ROLES.filter(
      (role) => (role !== UserRole.ECO_FRIENDLY_STORE && role !== UserRole.CHARITY_SHOP))
  },
  { route: "/assisted-seller", role: SELLER_ROLES },
];

type DecodedToken = {
  role: UserRole;
};

export default function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("fashion-access-token")?.value;
  // const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (!token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname + search);

    const response = NextResponse.redirect(signInUrl);

    response.headers.set('x-middleware-cache', 'no-cache')

    return response;
  } else {
    try {
      const { role } = jwtDecode<DecodedToken>(token);

      // Profile routes
      const profilePages = getRoutesByRole(role);

      const profileRoutes = profilePages.flatMap(
        (page) => page?.routs ?? []
      );

      const isAllowedProfilePath = profileRoutes.some((item) =>
        isPathMatched(pathname, item.rout)
      );

      // Seller routes
      const isAllowedSellerPath = sellerRoutes.some(
        (item) =>
          item.role.includes(role) &&
          isPathMatched(pathname, item.route)
      );

      // Allow authorized routes
      if (isAllowedProfilePath || isAllowedSellerPath) {
        return NextResponse.next();
      }

      // Unauthorized access
      return NextResponse.redirect(new URL("/", req.url));

    } catch {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/sell/:path*",
    "/favourites",
    "/notifications",
    "/inbox",
    "/checkout/:path*",
    "/shopping-cart",
    "/assisted-seller",
  ],
};

import { NextResponse } from "next/server";
import { authRoutes } from "./lib/authRoutes";

export default function middleware(req: any) {
  const { nextUrl } = req;
  const isLoggedIn = req.cookies.get("fashion-access-token")?.value;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (!isLoggedIn && !isAuthRoute) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set(
      "callbackUrl",
      nextUrl.pathname + nextUrl.search,
    );
    const response = NextResponse.redirect(signInUrl);

    response.headers.set('x-middleware-cache', 'no-cache')

    return response;
  }
  
  return NextResponse.next()
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

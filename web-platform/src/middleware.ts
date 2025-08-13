import { NextRequest, NextResponse } from "next/server";

import { getConfigs } from "./configs";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const access = req.cookies.get("access")?.value;
  const refresh = req.cookies.get("refresh")?.value;

  if (!getConfigs().isApp) {
    if (path.startsWith("/dashboard") && !refresh && !access) {
      if (
        path !== "/dashboard/delete-account" &&
        path !== "/dashboard/trips" &&
        path !== "/dashboard/needs/shipping" &&
        path !== "/dashboard/needs/shopping" &&
        path !== "/dashboard/requests" &&
        path !== "/dashboard/orders"
      ) {
        return NextResponse.redirect(
          new URL("/sign-in?redirect=%2F%3F", req.nextUrl),
        );
      }
    }
    if (path === "/dashboard/needs") {
      return NextResponse.redirect(new URL(path + "/shipping", req.nextUrl));
    }
  } else {
    if (path === "/") {
      return NextResponse.redirect(
        new URL("/connect-hub/request-to-passengers", req.nextUrl),
      );
    }
  }

  if (path === "/check-auth") {
    const url = req.nextUrl;

    if (!url.searchParams.has("redirect")) {
      url.searchParams.append("redirect", "/");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[png|svg|jpg|jpeg]).*)"],
};

import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "./config/configEnv";

const AUTH_COOKIE_NAME = CONFIG.auth.cookieName;

const protectedRoutes = ["/dashboard", "/library", "/player", "/profile"];
const authRoutes = ["/login", "/register"];

const isRouteMatch = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (isRouteMatch(pathname, protectedRoutes) && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isRouteMatch(pathname, authRoutes) && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|images).*)"],
};

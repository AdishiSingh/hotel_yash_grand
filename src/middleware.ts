import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MANAGEMENT_COOKIE_NAME = "management_token";
const CUSTOMER_COOKIE_NAME = "customer_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. CUSTOMER PORTAL AUTH & ROUTE PROTECTION
  if (pathname.startsWith("/customer")) {
    const customerToken = request.cookies.get(CUSTOMER_COOKIE_NAME)?.value;

    const authPages = [
      "/customer/login",
      "/customer/register",
      "/customer/forgot-password",
      "/customer/reset-password",
    ];

    const isAuthPage = authPages.some((page) => pathname.startsWith(page));

    // If accessing login/register/forgot-password while logged in -> redirect to /customer/dashboard
    if (isAuthPage) {
      if (customerToken) {
        return NextResponse.redirect(new URL("/customer/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Protected customer routes: /customer/profile, /customer/dashboard, /customer/bookings, /customer/security, etc.
    if (!customerToken) {
      const loginUrl = new URL("/customer/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. MANAGEMENT PORTAL MIDDLEWARE SECURITY
  if (pathname.startsWith("/management")) {
    const mgtToken = request.cookies.get(MANAGEMENT_COOKIE_NAME)?.value;

    // Login Page Exception
    if (pathname === "/management/login") {
      if (mgtToken) {
        return NextResponse.redirect(new URL("/management", request.url));
      }
      return NextResponse.next();
    }

    // Protect all /management/* routes
    if (!mgtToken) {
      const loginUrl = new URL("/management/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. EXISTING DASHBOARD / POS / ADMIN ROUTE SECURITY
  if (pathname === "/dashboard/login" || pathname === "/unauthorized") {
    return NextResponse.next();
  }

  const protectedPrefixes = ["/dashboard", "/pos", "/admin"];
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  if (isProtected && !token) {
    const loginUrl = new URL("/dashboard/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/management/:path*",
    "/dashboard/:path*",
    "/pos/:path*",
    "/admin/:path*",
  ],
};

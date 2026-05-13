import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isProtectedPage = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/profile") || 
    pathname.startsWith("/admin") ||
    pathname === "/";

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

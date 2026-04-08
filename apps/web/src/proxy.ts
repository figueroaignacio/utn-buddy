import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/chat", "/projects", "/settings"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("refresh_token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/projects/:path*", "/settings/:path*", "/"],
};

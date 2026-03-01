import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "pt"],
  defaultLocale: "en",
});

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bypass intl middleware for /admin routes
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|api).*)",
  ],
};

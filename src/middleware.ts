import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "pt"],
  defaultLocale: "en",
});

// Routes that should NOT go through intl (no locale prefix)
const bypassPaths = [
  "/admin",
  "/home",
  "/pricing",
  "/privacy",
  "/terms",
  "/manifesto",
  "/join",
  "/study",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bypass intl middleware for root and non-locale routes
  if (pathname === "/" || bypassPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|api).*)",
  ],
};

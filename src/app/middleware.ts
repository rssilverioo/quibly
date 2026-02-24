import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "pt"],
  defaultLocale: "en",
});

export async function middleware(req: NextRequest) {
  const res = intlMiddleware(req);
  const { pathname } = req.nextUrl;

  // 🔓 Rotas públicas
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/manifesto") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/policy-privacy") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/join") ||
    pathname === "/" ||
    pathname.startsWith("/api/public");

  if (isPublic) return res;

  // 🔒 Protege o dashboard
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/documents")) {
    const token =
      req.cookies.get("token")?.value || // 🔹 cookie salvo após login
      req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.warn("[Middleware] Nenhum token encontrado");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await adminAuth.verifyIdToken(token);
      return res;
    } catch (err) {
      console.error("[Middleware] Token inválido:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|api/public).*)", // protege tudo, exceto assets e rotas públicas
  ],
};

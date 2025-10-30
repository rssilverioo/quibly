import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  localePrefix: "never",
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔓 Rotas públicas
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/manifesto") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/public");

  // 🔒 Rotas protegidas (dashboard / documentos)
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/documents");

  // ⚙️ 1. Evita loop de redirecionamento na home
  const hasLocaleCookie = req.cookies.has("NEXT_LOCALE");
  if (!hasLocaleCookie && pathname === "/") {
    const res = NextResponse.next();
    res.cookies.set("NEXT_LOCALE", "pt", { path: "/" });
    return res;
  }

  // ⚙️ 2. Se for rota pública → apenas aplica intlMiddleware
  if (isPublic) return intlMiddleware(req);

  // ⚙️ 3. Se for rota protegida → valida token
  if (isProtected) {
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.warn("[Middleware] Nenhum token encontrado");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await adminAuth.verifyIdToken(token);
      return intlMiddleware(req);
    } catch (err) {
      console.error("[Middleware] Token inválido:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ⚙️ 4. Qualquer outra rota → aplica intl normalmente
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api/public).*)"],
};

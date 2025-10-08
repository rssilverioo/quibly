import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

// POST /api/auth/session
export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    // Valida token e cria cookie
    const decoded = await adminAuth.verifyIdToken(idToken);

    const res = NextResponse.json({ success: true });
    res.cookies.set("token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("❌ Session error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

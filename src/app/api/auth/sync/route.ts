import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Invalid header" }, { status: 400 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const body = await req.json().catch(() => ({}));
    const email = decoded.email?.toLowerCase() ?? null;
    const name = body.name ?? decoded.name ?? null;
    const photoUrl = decoded.picture ?? null;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ firebaseUid: decoded.uid }, ...(email ? [{ email }] : [])],
      },
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          firebaseUid: decoded.uid,
          email,
          name,
          photoUrl,
          updatedAt: new Date(),
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email,
          name,
          photoUrl,
          plan: "FREE",
          xp: 0,
          streak: 0,
          level: "Iniciante",
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      xp: user.xp,
      streak: user.streak,
      level: user.level,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

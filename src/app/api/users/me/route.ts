import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 🔒 Verifica o token Firebase
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔍 Busca o usuário autenticado + dados relacionados
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: {
        Subscription: true, // 👈 relação 1:1
        documents: {
          select: { id: true, title: true, createdAt: true },
        },
        sets: {
          select: { id: true, topic: true, createdAt: true },
        },
        flashcards: {
          select: { id: true, front: true, flashcardSetId: true },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch user",
        details: String(err),
      },
      { status: 500 }
    );
  }
}

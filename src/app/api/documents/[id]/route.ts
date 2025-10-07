import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

// GET /api/documents/:id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔐 Auth Firebase
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // 🔎 Busca usuário pelo uid Firebase
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔎 Busca documento + quizzes + flashcards
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        quizzes: {
          include: {
            questions: {
              include: { options: true },
            },
          },
        },
        sets: {
          include: { cards: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // 🔐 Valida se pertence ao usuário logado
    if (document.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      ...document,
      quizzesCount: document.quizzes.length,
      flashcardSetsCount: document.sets.length,
    });
  } catch (err) {
    console.error("❌ Fetch document failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch document", details: String(err) },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

// GET /api/documents
export async function GET(req: NextRequest) {
  try {
    // 🔐 Autenticação Firebase
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // 🔎 Busca o usuário logado
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 📄 Busca todos os documentos do usuário + contadores
    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      include: {
        sets: {
          select: { id: true }, // apenas para contar
        },
        quizzes: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 🧮 Adiciona contadores
    const result = documents.map((d) => ({
      id: d.id,
      title: d.title,
      fileUrl: d.fileUrl,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      flashcardSetsCount: d.sets.length,
      quizzesCount: d.quizzes.length,
      hasFlashcards: d.sets.length > 0,
      hasQuizzes: d.quizzes.length > 0,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ Fetch documents failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch documents", details: String(err) },
      { status: 500 }
    );
  }
}

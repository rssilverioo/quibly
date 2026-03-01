import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      include: {
        flashcardSets: {
          select: { id: true },
        },
        quizzes: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = documents.map((d) => ({
      id: d.id,
      title: d.title,
      fileUrl: d.fileUrl,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      flashcardSetsCount: d.flashcardSets.length,
      quizzesCount: d.quizzes.length,
      hasFlashcards: d.flashcardSets.length > 0,
      hasQuizzes: d.quizzes.length > 0,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Fetch documents failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch documents", details: String(err) },
      { status: 500 }
    );
  }
}

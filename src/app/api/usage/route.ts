import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const LIMITS = {
  FREE: { flashcards: 999, quizzes: 999 },
  PRO: { flashcards: 999, quizzes: 999 },
} as const;

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

    const today = new Date().toISOString().split("T")[0];
    const usage = await prisma.dailyUsage.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
    });

    const limits = LIMITS[user.plan];

    return NextResponse.json({
      flashcards: {
        used: usage?.flashcardsGenerated ?? 0,
        limit: limits.flashcards,
        remaining: Math.max(0, limits.flashcards - (usage?.flashcardsGenerated ?? 0)),
      },
      quizzes: {
        used: usage?.quizzesGenerated ?? 0,
        limit: limits.quizzes,
        remaining: Math.max(0, limits.quizzes - (usage?.quizzesGenerated ?? 0)),
      },
    });
  } catch (err) {
    console.error("Usage fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch usage", details: String(err) },
      { status: 500 }
    );
  }
}

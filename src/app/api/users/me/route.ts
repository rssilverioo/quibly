import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: {
        documents: {
          select: { id: true, title: true, createdAt: true },
        },
        flashcardSets: {
          select: { id: true, topic: true, createdAt: true, _count: { select: { cards: true } } },
          orderBy: { createdAt: "desc" },
        },
        quizzes: {
          select: { id: true, topic: true, createdAt: true, _count: { select: { questions: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get today's usage
    const today = new Date().toISOString().split("T")[0];
    const dailyUsage = await prisma.dailyUsage.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
    });

    return NextResponse.json({
      ...user,
      dailyUsage: dailyUsage || { flashcardsGenerated: 0, quizzesGenerated: 0 },
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { error: "Failed to fetch user", details: String(err) },
      { status: 500 }
    );
  }
}

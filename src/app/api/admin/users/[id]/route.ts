import { requireAdmin } from "@/lib/adminAuth.guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        documents: {
          select: { id: true, title: true, subject: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
        flashcardSets: {
          select: {
            id: true,
            topic: true,
            createdAt: true,
            _count: { select: { cards: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        quizzes: {
          select: {
            id: true,
            topic: true,
            createdAt: true,
            _count: { select: { questions: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        dailyUsages: {
          where: { date: { gte: thirtyDaysAgoStr } },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Error fetching admin user detail:", err);
    return NextResponse.json(
      { error: "Failed to fetch user", details: String(err) },
      { status: 500 }
    );
  }
}

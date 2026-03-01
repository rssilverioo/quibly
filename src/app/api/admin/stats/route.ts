import { requireAdmin } from "@/lib/adminAuth.guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth) return auth.error;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      proUsers,
      activeToday,
      activeThisWeek,
      totalFlashcardSets,
      totalQuizzes,
      totalDocuments,
      generationsToday,
      topUsersByXP,
      recentSignups,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: "PRO" } }),
      prisma.dailyUsage.findMany({
        where: { date: today },
        select: { userId: true },
        distinct: ["userId"],
      }),
      prisma.user.count({
        where: { updatedAt: { gte: weekAgo } },
      }),
      prisma.flashcardSet.count(),
      prisma.quiz.count(),
      prisma.document.count(),
      prisma.dailyUsage.aggregate({
        where: { date: today },
        _sum: { flashcardsGenerated: true, quizzesGenerated: true },
      }),
      prisma.user.findMany({
        orderBy: { xp: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          photoUrl: true,
          xp: true,
          level: true,
          streak: true,
          plan: true,
        },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          photoUrl: true,
          plan: true,
          createdAt: true,
        },
      }),
    ]);

    const freeUsers = totalUsers - proUsers;
    const estimatedMRR = proUsers * 9.9; // estimated PRO price

    return NextResponse.json({
      users: {
        total: totalUsers,
        pro: proUsers,
        free: freeUsers,
        activeToday: activeToday.length,
        activeThisWeek,
      },
      content: {
        flashcardSets: totalFlashcardSets,
        quizzes: totalQuizzes,
        documents: totalDocuments,
      },
      generationsToday: {
        flashcards: generationsToday._sum.flashcardsGenerated || 0,
        quizzes: generationsToday._sum.quizzesGenerated || 0,
      },
      topUsersByXP,
      recentSignups,
      estimatedMRR,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats", details: String(err) },
      { status: 500 }
    );
  }
}

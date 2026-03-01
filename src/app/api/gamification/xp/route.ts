import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/lib/gamification";

export const dynamic = "force-dynamic";

const XP_VALUES = {
  flashcard_review: 10,
  quiz_correct: 20,
  quiz_wrong: 5,
} as const;

type XPAction = keyof typeof XP_VALUES;

export async function POST(req: NextRequest) {
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

    const { action } = (await req.json()) as { action: XPAction };

    if (!XP_VALUES[action]) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const points = XP_VALUES[action];
    const stats = await awardXP(user.id, points);

    return NextResponse.json({ ...stats, pointsAwarded: points });
  } catch (err) {
    console.error("XP award failed:", err);
    return NextResponse.json(
      { error: "Failed to award XP", details: String(err) },
      { status: 500 }
    );
  }
}

import { prisma } from "./prisma";

const LIMITS = {
  FREE: { flashcards: 999, quizzes: 999 },
  PRO: { flashcards: 999, quizzes: 999 },
} as const;

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export async function checkUsageLimit(
  userId: string,
  plan: "FREE" | "PRO",
  type: "flashcards" | "quizzes"
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const today = getTodayString();
  const limit = LIMITS[plan][type];

  const usage = await prisma.dailyUsage.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  const used = type === "flashcards"
    ? (usage?.flashcardsGenerated ?? 0)
    : (usage?.quizzesGenerated ?? 0);

  return { allowed: used < limit, used, limit };
}

export async function incrementUsage(
  userId: string,
  type: "flashcards" | "quizzes"
): Promise<void> {
  const today = getTodayString();
  const field = type === "flashcards" ? "flashcardsGenerated" : "quizzesGenerated";

  await prisma.dailyUsage.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, [field]: 1 },
    update: { [field]: { increment: 1 } },
  });
}

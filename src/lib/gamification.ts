import { prisma } from "./prisma";

const LEVELS: { name: string; minXp: number }[] = [
  { name: "Iniciante", minXp: 0 },
  { name: "Estudante", minXp: 100 },
  { name: "Mestre", minXp: 500 },
  { name: "Genio", minXp: 2000 },
];

export function calculateLevel(xp: number): string {
  let level = LEVELS[0].name;
  for (const l of LEVELS) {
    if (xp >= l.minXp) level = l.name;
  }
  return level;
}

export async function awardXP(userId: string, points: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const newXp = user.xp + points;
  const newLevel = calculateLevel(newXp);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
  let newStreak = user.streak;

  if (lastStudy) {
    lastStudy.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day — keep streak
    } else if (diffDays === 1) {
      // Consecutive day — increment
      newStreak += 1;
    } else {
      // Gap — reset
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      lastStudyDate: new Date(),
    },
  });

  return {
    xp: updated.xp,
    streak: updated.streak,
    level: updated.level,
    lastStudyDate: updated.lastStudyDate,
  };
}

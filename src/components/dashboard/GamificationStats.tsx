"use client";

import XPProgressBar from "./XPProgressBar";
import StreakBadge from "./StreakBadge";
import LevelBadge from "./LevelBadge";
import { useTranslations } from "next-intl";

type UsageData = {
  flashcards: { used: number; limit: number };
  quizzes: { used: number; limit: number };
};

type Props = {
  xp: number;
  streak: number;
  level: string;
  usage?: UsageData | null;
};

export default function GamificationStats({ xp, streak, level, usage }: Props) {
  const t = useTranslations("Home");

  const totalUsed = (usage?.flashcards.used ?? 0) + (usage?.quizzes.used ?? 0);
  const totalLimit = (usage?.flashcards.limit ?? 0) + (usage?.quizzes.limit ?? 0);

  return (
    <div className="bg-[#11141A] border border-[#1E212A] rounded-2xl p-5">
      {/* Desktop: horizontal layout */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex-1">
          <XPProgressBar xp={xp} level={level} />
        </div>
        <div className="h-10 w-px bg-[#1E212A]" />
        <StreakBadge streak={streak} />
        <div className="h-10 w-px bg-[#1E212A]" />
        <LevelBadge level={level} />
        {usage && (
          <>
            <div className="h-10 w-px bg-[#1E212A]" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold text-white">{totalUsed}/{totalLimit}</span>
              <span className="text-xs text-gray-500">{t("dailyUsage")}</span>
            </div>
          </>
        )}
      </div>

      {/* Mobile: 2x2 grid */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        <div className="col-span-2">
          <XPProgressBar xp={xp} level={level} />
        </div>
        <div className="flex flex-col items-center justify-center bg-[#0B0D12] rounded-xl p-3">
          <StreakBadge streak={streak} />
        </div>
        <div className="flex flex-col items-center justify-center bg-[#0B0D12] rounded-xl p-3">
          <LevelBadge level={level} />
        </div>
        {usage && (
          <div className="col-span-2 flex items-center justify-center gap-2 bg-[#0B0D12] rounded-xl p-3">
            <span className="text-sm font-bold text-white">{totalUsed}/{totalLimit}</span>
            <span className="text-xs text-gray-500">{t("dailyUsage")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

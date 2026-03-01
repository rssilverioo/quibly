"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";

const LEVEL_THRESHOLDS = [
  { name: "Iniciante", minXp: 0, maxXp: 99 },
  { name: "Estudante", minXp: 100, maxXp: 499 },
  { name: "Mestre", minXp: 500, maxXp: 1999 },
  { name: "Genio", minXp: 2000, maxXp: Infinity },
];

function getCurrentLevel(xp: number) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) return LEVEL_THRESHOLDS[i];
  }
  return LEVEL_THRESHOLDS[0];
}

function getNextThreshold(xp: number): number {
  for (const level of LEVEL_THRESHOLDS) {
    if (xp < level.maxXp + 1 && level.maxXp !== Infinity) {
      return level.maxXp + 1;
    }
  }
  return xp;
}

type Props = {
  xp: number;
  level: string;
  compact?: boolean;
};

export default function XPProgressBar({ xp, level, compact = false }: Props) {
  const t = useTranslations("Gamification");
  const currentLevel = getCurrentLevel(xp);
  const nextThreshold = getNextThreshold(xp);
  const progressInLevel = xp - currentLevel.minXp;
  const levelRange = nextThreshold - currentLevel.minXp;
  const percentage = currentLevel.maxXp === Infinity ? 100 : Math.min((progressInLevel / levelRange) * 100, 100);

  const levelKey = level.toLowerCase() as "iniciante" | "estudante" | "mestre" | "genio";
  const translatedLevel = t(`levels.${levelKey}`);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Zap size={14} className="text-yellow-400" />
        <div className="w-20 h-1.5 bg-[#1E212A] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <span className="text-xs text-yellow-400 font-semibold">{xp}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">{translatedLevel}</span>
        </div>
        <span className="text-xs text-gray-400">
          {xp} / {currentLevel.maxXp === Infinity ? "MAX" : nextThreshold} {t("xp")}
        </span>
      </div>
      <div className="w-full h-3 bg-[#1E212A] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

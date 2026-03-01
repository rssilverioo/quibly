"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  streak: number;
  compact?: boolean;
};

export default function StreakBadge({ streak, compact = false }: Props) {
  const t = useTranslations("Gamification");

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <motion.div
          animate={streak > 0 ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Flame
            size={14}
            className={streak > 0 ? "text-orange-400" : "text-gray-600"}
          />
        </motion.div>
        <span
          className={`text-xs font-semibold ${
            streak > 0 ? "text-orange-400" : "text-gray-600"
          }`}
        >
          {streak}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        animate={
          streak > 0
            ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
            : {}
        }
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Flame
          size={28}
          className={streak > 0 ? "text-orange-400" : "text-gray-600"}
        />
      </motion.div>
      {streak > 0 ? (
        <span className="text-lg font-bold text-orange-400">{streak}</span>
      ) : (
        <span className="text-xs text-gray-500">{t("startStreak")}</span>
      )}
      <span className="text-xs text-gray-500">{t("streak")}</span>
    </div>
  );
}

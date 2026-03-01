"use client";

import { useTranslations } from "next-intl";
import { BookOpen, GraduationCap, Award, Crown } from "lucide-react";

const LEVEL_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Iniciante: {
    color: "text-gray-300",
    bg: "bg-gray-600/20",
    icon: <BookOpen size={14} />,
  },
  Estudante: {
    color: "text-blue-400",
    bg: "bg-blue-600/20",
    icon: <GraduationCap size={14} />,
  },
  Mestre: {
    color: "text-purple-400",
    bg: "bg-purple-600/20",
    icon: <Award size={14} />,
  },
  Genio: {
    color: "text-yellow-400",
    bg: "bg-yellow-600/20",
    icon: <Crown size={14} />,
  },
};

type Props = {
  level: string;
  compact?: boolean;
};

export default function LevelBadge({ level, compact = false }: Props) {
  const t = useTranslations("Gamification");
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.Iniciante;
  const levelKey = level.toLowerCase() as "iniciante" | "estudante" | "mestre" | "genio";
  const translatedLevel = t(`levels.${levelKey}`);

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${config.color} ${config.bg}`}>
        {config.icon}
        {translatedLevel}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
        <span className={config.color}>{config.icon}</span>
      </div>
      <span className={`text-sm font-semibold ${config.color}`}>{translatedLevel}</span>
      <span className="text-xs text-gray-500">{t("level")}</span>
    </div>
  );
}

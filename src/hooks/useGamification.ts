"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type XPAction = "flashcard_review" | "quiz_correct" | "quiz_wrong";

type XPResult = {
  xp: number;
  streak: number;
  level: string;
  lastStudyDate: string | null;
  pointsAwarded: number;
};

export function useGamification() {
  const [loading, setLoading] = useState(false);

  const awardXP = async (action: XPAction): Promise<XPResult | null> => {
    try {
      setLoading(true);
      const { data } = await api.post<XPResult>("/gamification/xp", { action });
      return data;
    } catch (err) {
      console.error("Failed to award XP:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { awardXP, loading };
}

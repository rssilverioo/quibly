"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

type UsageData = {
  flashcards: { used: number; limit: number; remaining: number };
  quizzes: { used: number; limit: number; remaining: number };
};

export function useUsage() {
  const { user, loading: authLoading } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsage = async () => {
    try {
      const { data } = await api.get<UsageData>("/usage");
      setUsage(data);
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }
    fetchUsage();
  }, [user, authLoading]);

  return { usage, loading, refetch: fetchUsage };
}

"use client";

import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Layers } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import CompactUploadZone from "@/components/dashboard/CompactUploadZone";
import { useUsage } from "@/hooks/useUsage";

type FlashcardSetItem = {
  id: string;
  topic: string;
  createdAt: string;
  _count?: { cards: number };
  cards?: { id: string }[];
};

export default function FlashcardsListPage() {
  const t = useTranslations("Flashcards");
  const locale = useLocale();
  const [sets, setSets] = useState<FlashcardSetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { usage } = useUsage();

  const fetchSets = useCallback(async () => {
    try {
      const { data } = await api.get("/users/me");
      setSets(data.flashcardSets || []);
    } catch {
      toast.error(t("loadError"));
    }
  }, [t]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setLoading(false);
      await fetchSets();
      setLoading(false);
    });

    return () => unsub();
  }, [fetchSets]);

  const limitReached = usage ? usage.flashcards.remaining <= 0 : false;

  const handleGenerateComplete = (id: string) => {
    fetchSets();
    if (id) {
      // Could navigate to the new set, but refreshing the list is enough
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#1E212A] rounded-lg animate-pulse" />
          <div className="h-7 bg-[#1E212A] rounded w-32 animate-pulse" />
        </div>
        <div className="h-14 bg-[#11141A] border border-[#1E212A] rounded-2xl animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#11141A] border border-[#1E212A] rounded-2xl p-5 animate-pulse">
              <div className="h-5 bg-[#1E212A] rounded w-3/4 mb-3" />
              <div className="h-3 bg-[#1E212A] rounded w-1/2 mb-4" />
              <div className="h-8 bg-[#1E212A] rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-[70vh] text-center px-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-4">
          <Layers size={28} className="text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{t("emptyTitle")}</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">{t("uploadAndGenerate")}</p>
        <div className="w-full max-w-md">
          <CompactUploadZone
            autoGenerate="flashcards"
            onGenerateComplete={handleGenerateComplete}
            limitReached={limitReached}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <Layers size={18} className="text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Flashcards</h1>
        <span className="px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-medium">
          {sets.length} {t("sets")}
        </span>
      </div>

      {/* Upload zone */}
      <CompactUploadZone
        autoGenerate="flashcards"
        onGenerateComplete={handleGenerateComplete}
        limitReached={limitReached}
      />

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {sets.map((set, index) => (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
          >
            <Link
              href={`/${locale}/dashboard/flashcards/${set.id}`}
              className="block bg-[#11141A] border border-[#1E212A] rounded-2xl p-5 transition-all duration-200 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Layers size={16} className="text-blue-500" />
                <h3 className="font-semibold text-white line-clamp-1 text-sm">{set.topic}</h3>
              </div>
              <p className="text-gray-500 text-xs mb-4">
                {new Date(set.createdAt).toLocaleDateString()}
                {set._count?.cards != null && (
                  <span className="ml-2 text-gray-400">({set._count.cards} cards)</span>
                )}
              </p>
              <span className="inline-block px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition">
                {t("study")}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { HelpCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import CompactUploadZone from "@/components/dashboard/CompactUploadZone";
import { useUsage } from "@/hooks/useUsage";

type QuizItem = {
  id: string;
  topic: string | null;
  createdAt: string;
};

export default function QuizzesListPage() {
  const t = useTranslations("Quiz");
  const locale = useLocale();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { usage } = useUsage();

  const fetchQuizzes = useCallback(async () => {
    try {
      const { data } = await api.get("/users/me");
      setQuizzes(data.quizzes || []);
    } catch {
      toast.error(t("loadError"));
    }
  }, [t]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setLoading(false);
      await fetchQuizzes();
      setLoading(false);
    });

    return () => unsub();
  }, [fetchQuizzes]);

  const limitReached = usage ? usage.quizzes.remaining <= 0 : false;

  const handleGenerateComplete = () => {
    fetchQuizzes();
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

  if (quizzes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-[70vh] text-center px-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-green-600/10 flex items-center justify-center mb-4">
          <HelpCircle size={28} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{t("emptyTitle")}</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">{t("uploadAndGenerate")}</p>
        <div className="w-full max-w-md">
          <CompactUploadZone
            autoGenerate="quiz"
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
        <div className="w-9 h-9 rounded-xl bg-green-600/20 flex items-center justify-center">
          <HelpCircle size={18} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Quizzes</h1>
        <span className="px-2.5 py-0.5 rounded-full bg-green-600/20 text-green-400 text-xs font-medium">
          {quizzes.length}
        </span>
      </div>

      {/* Upload zone */}
      <CompactUploadZone
        autoGenerate="quiz"
        onGenerateComplete={handleGenerateComplete}
        limitReached={limitReached}
      />

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
          >
            <Link
              href={`/${locale}/dashboard/quizzes/${quiz.id}`}
              className="block bg-[#11141A] border border-[#1E212A] rounded-2xl p-5 transition-all duration-200 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle size={16} className="text-green-500" />
                <h3 className="font-semibold text-white line-clamp-1 text-sm">
                  {quiz.topic || "Quiz"}
                </h3>
              </div>
              <p className="text-gray-500 text-xs mb-4">
                {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
              <span className="inline-block px-3 py-1.5 rounded-xl text-xs font-medium bg-green-600/20 text-green-400 hover:bg-green-600/30 transition">
                {t("play")}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

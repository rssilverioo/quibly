"use client";

import { api } from "@/lib/api";
import { useAppUser } from "@/hooks/useAppUser";
import { useUsage } from "@/hooks/useUsage";
import { Layers, HelpCircle, Loader2, MoreHorizontal, Sparkles, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import GamificationStats from "@/components/dashboard/GamificationStats";
import StudyCard from "@/components/dashboard/StudyCard";

type DocumentItem = {
  id: string;
  title: string;
  hasFlashcards: boolean;
  hasQuizzes: boolean;
};

type FlashcardSetItem = {
  id: string;
  topic: string;
  createdAt: string;
  _count?: { cards: number };
};

type QuizItem = {
  id: string;
  topic: string | null;
  createdAt: string;
};

export default function HomePage() {
  const t = useTranslations("Home");
  const flashT = useTranslations("Flashcards");
  const quizT = useTranslations("Quiz");
  const toastT = useTranslations("Toasts");
  const locale = useLocale();

  const { appUser, loading: userLoading } = useAppUser();
  const { usage } = useUsage();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSetItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [topicInput, setTopicInput] = useState("");
  const [topicGenerating, setTopicGenerating] = useState<"flashcards" | "quiz" | null>(null);

  const fetchData = useCallback(async () => {
    if (!appUser) return;
    try {
      const [docsRes, userRes] = await Promise.all([
        api.get<DocumentItem[]>("/documents"),
        api.get("/users/me"),
      ]);
      setDocuments(docsRes.data);
      setFlashcardSets(userRes.data.flashcardSets || []);
      setQuizzes(userRes.data.quizzes || []);
    } catch {
      toast.error(toastT("loadError"));
    } finally {
      setLoading(false);
    }
  }, [appUser, toastT]);

  useEffect(() => {
    if (userLoading) return;
    if (!appUser) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [appUser, userLoading, fetchData]);

  const handleDelete = (id: string) => {
    setMenuOpen(null);
    const tId = toast.warning(t("confirmDelete"), {
      duration: 5000,
      action: {
        label: t("deleteBtn"),
        onClick: async () => {
          try {
            setDeleting(id);
            await api.delete(`/documents/${id}`);
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
            toast.success(toastT("deletedSuccess"));
          } catch {
            toast.error(toastT("deleteError"));
          } finally {
            setDeleting(null);
          }
          toast.dismiss(tId);
        },
      },
      cancel: { label: t("cancelBtn"), onClick: () => toast.dismiss(tId) },
    });
  };

  const handleGenerate = async (type: "quiz" | "flashcards", id: string) => {
    try {
      setProcessing(id);
      const endpoint = type === "quiz" ? "/generate/quiz" : "/generate/flashcards";
      await api.post(endpoint, { documentId: id });

      toast.success(
        type === "quiz" ? t("quizGeneratedSuccess") : t("flashcardsGeneratedSuccess")
      );

      await fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 429) {
        toast.error(t("dailyLimitReached"));
      } else {
        toast.error(t("generationError"));
      }
    } finally {
      setProcessing(null);
    }
  };

  const handleTopicGenerate = async (type: "flashcards" | "quiz") => {
    if (!topicInput.trim()) {
      toast.error(t("topicEmpty"));
      return;
    }
    try {
      setTopicGenerating(type);
      await api.post("/generate/topic", { topic: topicInput.trim(), type });
      toast.success(
        type === "quiz" ? t("quizGeneratedSuccess") : t("flashcardsGeneratedSuccess")
      );
      setTopicInput("");
      await fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 429) {
        toast.error(t("dailyLimitReached"));
      } else {
        toast.error(t("generationError"));
      }
    } finally {
      setTopicGenerating(null);
    }
  };

  // Loading skeleton
  if (loading || userLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-[#11141A] border border-[#1E212A] rounded-2xl p-5 animate-pulse">
          <div className="h-6 bg-[#1E212A] rounded w-1/3 mb-3" />
          <div className="h-3 bg-[#1E212A] rounded w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#11141A] border border-[#1E212A] rounded-2xl p-5 animate-pulse">
              <div className="h-5 bg-[#1E212A] rounded w-3/4 mb-3" />
              <div className="h-3 bg-[#1E212A] rounded w-1/2 mb-6" />
              <div className="h-8 bg-[#1E212A] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userName = appUser?.name?.split(" ")[0] || "";
  const hasDocuments = documents.length > 0;
  const hasStudyContent = flashcardSets.length > 0 || quizzes.length > 0;

  return (
    <div className="space-y-8">
      {/* Section 1: Welcome + Gamification Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {userName && (
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {t("welcomeBack", { name: userName })}
          </h1>
        )}
        {appUser && (
          <GamificationStats
            xp={appUser.xp}
            streak={appUser.streak}
            level={appUser.level}
            usage={usage}
          />
        )}
      </motion.div>

      {/* Section 2: Generate from Topic */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#11141A] border border-[#1E212A] rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-purple-400" />
          <p className="text-sm text-gray-400">{t("topicHint")}</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder={t("topicPlaceholder")}
            disabled={topicGenerating !== null}
            className="flex-1 bg-[#0B0D12] border border-[#1E212A] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && topicInput.trim()) {
                handleTopicGenerate("flashcards");
              }
            }}
          />
          <button
            onClick={() => handleTopicGenerate("flashcards")}
            disabled={topicGenerating !== null || !topicInput.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            {topicGenerating === "flashcards" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Layers size={14} />
            )}
            <span className="hidden sm:inline">Flashcards</span>
          </button>
          <button
            onClick={() => handleTopicGenerate("quiz")}
            disabled={topicGenerating !== null || !topicInput.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-medium bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            {topicGenerating === "quiz" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <HelpCircle size={14} />
            )}
            <span className="hidden sm:inline">Quiz</span>
          </button>
        </div>
      </motion.div>

      {/* Section 3: My Documents */}
      {hasDocuments ? (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold mb-4">{t("myDocuments")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative bg-[#11141A] border border-[#1E212A] rounded-2xl p-5 transition-all duration-200 hover:border-[#2A2E38] group flex flex-col justify-between"
                >
                  {/* Menu button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setMenuOpen(menuOpen === doc.id ? null : doc.id)}
                      className="text-gray-500 hover:text-gray-300 transition p-1"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {menuOpen === doc.id && (
                      <div className="absolute right-0 top-8 bg-[#1A1D24] border border-[#1E212A] rounded-lg shadow-xl z-10 w-32">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleting === doc.id}
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#1E212A] rounded-lg transition"
                        >
                          {deleting === doc.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            t("deleteBtn")
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Status dot + title */}
                    <div className="flex items-start gap-2 mb-2 pr-8">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          doc.hasFlashcards || doc.hasQuizzes
                            ? "bg-green-500"
                            : "bg-gray-600"
                        }`}
                      />
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                        {doc.title}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-xs mb-4 ml-4">
                      {doc.hasFlashcards && doc.hasQuizzes
                        ? t("ready")
                        : doc.hasFlashcards || doc.hasQuizzes
                        ? t("ready")
                        : t("needsGeneration")}
                    </p>
                  </div>

                  {/* Contextual action buttons */}
                  <div className="flex gap-2 mt-auto">
                    {doc.hasFlashcards ? (
                      <Link
                        href={`/${locale}/dashboard/flashcards`}
                        className="flex-1 py-2 rounded-xl text-xs font-medium text-center bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition"
                      >
                        {t("viewFlashcards")}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleGenerate("flashcards", doc.id)}
                        disabled={processing === doc.id}
                        className="flex-1 py-2 rounded-xl text-xs font-medium text-center bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
                      >
                        {processing === doc.id ? (
                          <Loader2 className="w-3.5 h-3.5 mx-auto animate-spin" />
                        ) : (
                          t("generateFlashcards")
                        )}
                      </button>
                    )}

                    {doc.hasQuizzes ? (
                      <Link
                        href={`/${locale}/dashboard/quizzes`}
                        className="flex-1 py-2 rounded-xl text-xs font-medium text-center bg-green-600/20 text-green-400 hover:bg-green-600/30 transition"
                      >
                        {t("viewQuiz")}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleGenerate("quiz", doc.id)}
                        disabled={processing === doc.id}
                        className="flex-1 py-2 rounded-xl text-xs font-medium text-center bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-50"
                      >
                        {processing === doc.id ? (
                          <Loader2 className="w-3.5 h-3.5 mx-auto animate-spin" />
                        ) : (
                          t("generateQuiz")
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      ) : (
        /* Empty State — no documents */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6">
            <Sparkles size={36} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">{t("emptyHeroTitle")}</h2>
          <p className="text-gray-400 max-w-md mb-6">{t("emptyHeroDesc")}</p>
          <div className="flex gap-3">
            <Link
              href={`/${locale}/dashboard/flashcards`}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Flashcards
            </Link>
            <Link
              href={`/${locale}/dashboard/quizzes`}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition"
            >
              Quizzes
            </Link>
          </div>
        </motion.div>
      )}

      {/* Section 4: Continue Studying */}
      {hasStudyContent && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold">{t("continueStudying")}</h2>

          {/* Recent Flashcards */}
          {flashcardSets.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">{t("recentFlashcards")}</h3>
                <Link
                  href={`/${locale}/dashboard/flashcards`}
                  className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 transition"
                >
                  {t("seeAll")} <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {flashcardSets.slice(0, 4).map((set) => (
                  <StudyCard
                    key={set.id}
                    type="flashcards"
                    title={set.topic}
                    date={set.createdAt}
                    count={set._count?.cards}
                    href={`/${locale}/dashboard/flashcards/${set.id}`}
                    actionLabel={flashT("study")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Quizzes */}
          {quizzes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">{t("recentQuizzes")}</h3>
                <Link
                  href={`/${locale}/dashboard/quizzes`}
                  className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1 transition"
                >
                  {t("seeAll")} <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {quizzes.slice(0, 4).map((quiz) => (
                  <StudyCard
                    key={quiz.id}
                    type="quizzes"
                    title={quiz.topic || "Quiz"}
                    date={quiz.createdAt}
                    href={`/${locale}/dashboard/quizzes/${quiz.id}`}
                    actionLabel={quizT("play")}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.section>
      )}
    </div>
  );
}

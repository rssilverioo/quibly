"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";
import { useGamification } from "@/hooks/useGamification";
import { Check, X, Zap, RotateCcw, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Flashcard = {
  id: string;
  front: string;
  back: string;
  explain?: string | null;
  imageUrl?: string | null;
};

type FlashcardSetData = {
  id: string;
  topic: string;
  cards: Flashcard[];
};

export default function FlashcardViewerPage() {
  const t = useTranslations("Flashcards");
  const locale = useLocale();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const { awardXP } = useGamification();

  const [set, setSet] = useState<FlashcardSetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [knownCount, setKnownCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || !id) return setLoading(false);

      try {
        const { data } = await api.get(`/flashcard-sets/${id}`);
        setSet(data);
        setDeck([...(data.cards || [])]);
      } catch {
        toast.error(t("loadError"));
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [id, t]);

  const showXPToast = useCallback((points: number) => {
    setXpToast(points);
    setTimeout(() => setXpToast(null), 1200);
  }, []);

  const moveToNext = useCallback(() => {
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      newDeck.splice(currentCard, 1);

      if (newDeck.length === 0) {
        setCompleted(true);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        return [];
      }

      setCurrentCard((prev) => (prev >= newDeck.length ? 0 : prev));
      setFlipped(false);
      return newDeck;
    });
  }, [currentCard]);

  const handleKnow = useCallback(async () => {
    setDirection(1);
    const result = await awardXP("flashcard_review");
    if (result) {
      setXpEarned((prev) => prev + result.pointsAwarded);
      showXPToast(result.pointsAwarded);
    }
    setKnownCount((prev) => prev + 1);
    moveToNext();
  }, [awardXP, showXPToast, moveToNext]);

  const handleDontKnow = useCallback(() => {
    setDirection(-1);
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      const [removed] = newDeck.splice(currentCard, 1);
      newDeck.push(removed);
      return newDeck;
    });
    setFlipped(false);
  }, [currentCard]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed || !deck.length) return;

      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((v) => !v);
      } else if (e.code === "ArrowRight" || e.code === "ArrowUp") {
        e.preventDefault();
        handleKnow();
      } else if (e.code === "ArrowLeft" || e.code === "ArrowDown") {
        e.preventDefault();
        handleDontKnow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completed, deck.length, handleKnow, handleDontKnow]);

  const handleStudyAgain = () => {
    if (!set) return;
    setDeck([...(set.cards || [])]);
    setCurrentCard(0);
    setFlipped(false);
    setKnownCount(0);
    setXpEarned(0);
    setCompleted(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-gray-400 text-sm">{t("loading")}</span>
      </div>
    );
  }

  if (!set || deck.length === 0) {
    if (completed) {
      const totalCards = set?.cards.length || 0;
      const percentage = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0;

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center h-[70vh] text-center px-4"
        >
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
            <Zap size={36} className="text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{t("completed")}</h2>
          <div className="flex items-center gap-2 text-yellow-400 text-xl mb-4">
            <Zap size={22} />
            <span className="font-bold">+{xpEarned} XP</span>
          </div>
          <p className="text-gray-400 mb-2">
            {t("knownCards", { count: knownCount, total: totalCards })}
          </p>
          <p className="text-gray-500 text-sm mb-8">{percentage}%</p>

          <div className="flex gap-3">
            <button
              onClick={handleStudyAgain}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
            >
              <RotateCcw size={16} />
              {t("studyAgain")}
            </button>
            <Link
              href={`/${locale}/dashboard/flashcards`}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1E212A] hover:bg-[#252830] text-gray-300 rounded-xl text-sm font-medium transition"
            >
              <ArrowLeft size={16} />
              {t("backDashboard")}
            </Link>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400 px-6 text-center">
        <p className="text-lg mb-2">{t("noCards")}</p>
      </div>
    );
  }

  const card = deck[currentCard];
  const progress = set.cards.length > 0
    ? ((set.cards.length - deck.length) / set.cards.length) * 100
    : 0;

  return (
    <div className="flex flex-col items-center py-6 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-center">{set.topic}</h1>

      {/* Progress bar */}
      <div className="w-full bg-[#1E212A] h-2 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="text-center text-sm text-gray-500 mb-6">
        {deck.length} {t("remaining")}
      </p>

      {/* Floating XP toast */}
      <AnimatePresence>
        {xpToast !== null && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -30 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold backdrop-blur-sm"
          >
            <Zap size={14} />
            +{xpToast} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flashcard with AnimatePresence flip */}
      <div className="w-full perspective-1000 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id + (flipped ? "-back" : "-front")}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setFlipped((v) => !v)}
            className="cursor-pointer bg-[#11141A] border border-[#1E212A] rounded-2xl p-8 min-h-[280px] flex flex-col justify-center items-center text-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {!flipped ? (
              <>
                {card.imageUrl && (
                  <Image
                    src={card.imageUrl}
                    alt=""
                    width={112}
                    height={112}
                    className="w-28 h-28 object-cover rounded-lg mb-4"
                    unoptimized
                  />
                )}
                <p className="text-xl font-medium leading-relaxed">{card.front}</p>
                <p className="text-xs text-gray-600 mt-4">{t("flipHint")}</p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold mb-2 text-blue-400">{card.back}</p>
                {card.explain && (
                  <p className="text-gray-400 text-sm">{card.explain}</p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* XP earned indicator */}
      {xpEarned > 0 && (
        <div className="flex items-center gap-2 text-yellow-400 text-sm mb-4">
          <Zap size={16} />
          <span className="font-semibold">+{xpEarned} XP</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleDontKnow}
          className="flex items-center gap-2 px-6 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl transition font-medium border border-red-600/20"
        >
          <X size={20} />
          {t("dontKnow")}
        </button>
        <button
          onClick={handleKnow}
          className="flex items-center gap-2 px-6 py-3 bg-green-600/10 hover:bg-green-600/20 text-green-400 rounded-xl transition font-medium border border-green-600/20"
        >
          <Check size={20} />
          {t("iKnow")}
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-[11px] text-gray-600 mt-4 hidden md:block">
        Space: flip &middot; &rarr; I know &middot; &larr; Don&apos;t know
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";

type Flashcard = {
  id: string;
  front: string;
  back: string;
  explain?: string | null;
};

export default function FlashcardStudy() {
  const { id } = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Flashcards");
  const toastT = useTranslations("Toasts");

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [topic, setTopic] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Cronômetro
  const [timeLeft, setTimeLeft] = useState(30);
  const [paused, setPaused] = useState(false);

  // ===== Fetch Flashcards =====
  useEffect(() => {
    async function fetchDocument() {
      try {
        const { data } = await api.get(`/documents/${id}`);
        if (data.flashcardSets?.length > 0) {
          const firstSet = data.flashcardSets[0];
          setTopic(firstSet.topic);
          setCards(firstSet.cards);
        } else {
          toast.info(t("noCards"));
          router.push(`/${locale}/dashboard/home`);
        }
      } catch (err) {
        console.error("❌ Erro ao buscar flashcards:", err);
        toast.error(toastT("loadError"));
        router.push(`/${locale}/dashboard/home`);
      } finally {
        setLoading(false);
      }
    }
    fetchDocument();
  }, [id, locale, router, t, toastT]);

  // ===== Timer logic =====
  useEffect(() => {
    if (paused) return;

    if (timeLeft === 0) {
      if (!flipped) setFlipped(true);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, paused, flipped]);

  // Reset timer when changing card
  useEffect(() => {
    setTimeLeft(30);
    setPaused(false);
    setFlipped(false);
  }, [index]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0D12] text-white">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-400">{t("loading")}</p>
      </div>
    );

  if (!cards.length)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
        <p className="text-lg mb-2">{t("noCards")}</p>
        <button
          onClick={() => router.push(`/${locale}/dashboard/home`)}
          className="mt-4 text-blue-400 hover:text-blue-300 text-sm underline"
        >
          {t("backDashboard")}
        </button>
      </div>
    );

  const current = cards[index];

  const handleFlip = () => setFlipped(!flipped);
  const handleNext = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
    } else {
      toast.success(t("completed"));
    }
  };
  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B0D12] to-[#11141A] text-white px-6 py-10">
      <h1 className="text-3xl font-semibold mb-2 flex items-center gap-2">
        🧠 {topic}
      </h1>
      <p className="text-gray-400 mb-3">
        {t("card")} {index + 1} {t("of")} {cards.length}
      </p>

      {/* Cronômetro */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-40 h-2 bg-[#1E212A] rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-300">{timeLeft}s</span>
        <button
          onClick={() => setPaused((p) => !p)}
          className="text-xs text-blue-400 underline hover:text-blue-300"
        >
          {paused ? t("resume") : t("pause")}
        </button>
      </div>

      {/* Card */}
      <div
        className="relative w-[400px] h-[260px] perspective cursor-pointer select-none"
        onClick={handleFlip}
      >
        <div
          className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          <div className="absolute w-full h-full bg-[#11141A] text-gray-100 flex items-center justify-center rounded-2xl shadow-xl border border-[#1E212A] backface-hidden p-6 text-center text-lg font-medium">
            {current.front}
          </div>
          <div className="absolute w-full h-full bg-gradient-to-br from-blue-700 to-blue-500 text-white flex flex-col items-center justify-center rounded-2xl shadow-xl border border-[#1E212A] backface-hidden rotate-y-180 p-6 text-center">
            <p className="text-lg font-semibold">{current.back}</p>
            {current.explain && (
              <p className="text-sm text-blue-100 mt-3">{current.explain}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="px-4 py-2 rounded-lg bg-[#1E212A] hover:bg-[#252830] disabled:opacity-40 transition text-white"
        >
          ⬅️ {t("prev")}
        </button>
        <button
          onClick={handleNext}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
        >
          {t("next")} ➡️
        </button>
      </div>

      <button
        onClick={() => router.push(`/${locale}/dashboard/home`)}
        className="mt-8 text-blue-400 hover:text-blue-300 text-sm underline"
      >
        {t("backDashboard")}
      </button>

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}

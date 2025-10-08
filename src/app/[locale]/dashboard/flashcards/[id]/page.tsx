"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";

type Flashcard = {
  id: string;
  front: string;
  back: string;
  explain?: string | null;
};

type FlashcardSet = {
  id: string;
  topic: string | null;
  cards: Flashcard[];
};

type DocumentDetail = {
  id: string;
  title: string;
  sets?: FlashcardSet[]; // pode vir ausente dependendo do endpoint
};

export default function FlashcardsPage() {
  const t = useTranslations("Flashcards");
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [documentData, setDocumentData] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || !id) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/documents/${id}`);
        // o backend às vezes retorna objeto, às vezes [obj]
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setDocumentData(data ?? null);
      } catch (err) {
        console.error("Erro ao carregar flashcards:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-400">
        {t("loading")}
      </div>
    );
  }

  const sets = documentData?.sets ?? [];
  const allCards: Flashcard[] = sets.flatMap((s) => s.cards || []);

  if (!documentData || allCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400 px-6 text-center">
        <p className="text-lg mb-2">{t("emptyTitle")}</p>
        <p className="text-sm text-gray-500">{t("emptyDesc")}</p>
      </div>
    );
  }

  const card = allCards[currentCard];

  const nextCard = () => {
    setFlipped(false);
    setCurrentCard((prev) => (prev + 1 < allCards.length ? prev + 1 : 0));
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrentCard((prev) => (prev - 1 >= 0 ? prev - 1 : allCards.length - 1));
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-white flex flex-col items-center py-10 px-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {documentData.title}
        </h1>

        <div className="flex justify-center mb-6">
          <span className="text-sm text-gray-500">
            {t("counter", { current: currentCard + 1, total: allCards.length })}
          </span>
        </div>

        {/* Flashcard */}
        <div className="relative">
          <div
            onClick={() => setFlipped((v) => !v)}
            title={t("flipHint")}
            className="cursor-pointer bg-[#11141A] border border-[#1E212A] rounded-2xl p-8 min-h-[280px] flex flex-col justify-center items-center text-center transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Frente */}
            <div
              className="absolute inset-0 flex items-center justify-center p-6"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-xl font-medium leading-relaxed">{card.front}</p>
            </div>

            {/* Verso */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-6"
              style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
            >
              <p className="text-lg font-semibold mb-2 text-blue-400">{card.back}</p>
              {card.explain && (
                <p className="text-gray-400 text-sm">{card.explain}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevCard}
            className="px-4 py-2 bg-[#1E212A] hover:bg-[#242832] rounded-lg border border-[#2A2E38] transition"
          >
            {t("previous")}
          </button>
          <button
            onClick={nextCard}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            {t("next")}
          </button>
        </div>
      </div>
    </div>
  );
}

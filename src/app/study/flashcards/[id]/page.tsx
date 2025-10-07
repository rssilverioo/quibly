"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Flashcard = {
  id: string;
  front: string;
  back: string;
  explain?: string | null;
};

export default function FlashcardStudy() {
  const { id } = useParams();
  const router = useRouter();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [topic, setTopic] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const { data } = await api.get(`/documents/${id}`);
        if (data.sets?.length > 0) {
          const firstSet = data.sets[0];
          setTopic(firstSet.topic);
          setCards(firstSet.cards);
        } else {
          alert("Nenhum flashcard disponível para este documento.");
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Erro ao buscar flashcards:", err);
        alert("Erro ao buscar flashcards.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchDocument();
  }, [id, router]);

  if (loading) return <p className="text-center text-gray-400 mt-10">Carregando flashcards...</p>;
  if (!cards.length) return <p className="text-center text-gray-400 mt-10">Nenhum flashcard encontrado.</p>;

  const current = cards[index];
  const handleFlip = () => setFlipped(!flipped);
  const handleNext = () => {
    setFlipped(false);
    if (index < cards.length - 1) setIndex(index + 1);
    else alert("✅ Você concluiu todos os flashcards!");
  };
  const handlePrev = () => {
    setFlipped(false);
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 text-white px-6 py-10">
      <h1 className="text-3xl font-semibold mb-2 flex items-center gap-2">
        🧠 {topic}
      </h1>
      <p className="text-gray-400 mb-6">
        Flashcard {index + 1} de {cards.length}
      </p>

      {/* Card container */}
      <div
        className="relative w-[400px] h-[260px] perspective cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Frente */}
          <div className="absolute w-full h-full bg-white/95 text-gray-900 flex items-center justify-center rounded-2xl shadow-xl border border-white/10 backface-hidden p-6 text-center text-lg font-medium">
            {current.front}
          </div>
          {/* Verso */}
          <div className="absolute w-full h-full bg-gradient-to-br from-blue-700 to-blue-500 text-white flex flex-col items-center justify-center rounded-2xl shadow-xl border border-white/10 backface-hidden rotate-y-180 p-6 text-center">
            <p className="text-lg font-semibold">{current.back}</p>
            {current.explain && (
              <p className="text-sm text-blue-100 mt-3">{current.explain}</p>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 transition text-white"
        >
          ⬅️ Anterior
        </button>
        <button
          onClick={handleNext}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
        >
          Próximo ➡️
        </button>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-8 text-blue-400 hover:text-blue-300 text-sm underline"
      >
        Voltar ao Dashboard
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

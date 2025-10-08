"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import NextImage from "next/image";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ======================
// 🔹 Tipos
// ======================

type Option = {
  id: string;
  key: string;
  text: string;
  imageUrl: string | null;
  isCorrect: boolean;
};

type Question = {
  id: string;
  quizId: string;
  kind: "TEXT" | "IMAGE";
  prompt: string;
  answer: string;
  explain?: string | null;
  options: Option[];
};

type Quiz = {
  id: string;
  topic: string;
  documentId: string;
  userId: string;
  questions: Question[];
};

type Flashcard = {
  id: string;
  front: string;
  back: string;
  explain?: string | null;
};

type FlashcardSet = {
  id: string;
  topic: string;
  cards: Flashcard[];
};

type Document = {
  id: string;
  title: string;
  fileUrl: string;
  userId: string;
  subject?: string | null;
  content?: string | null;
  quizzes: Quiz[];
  sets: FlashcardSet[];
};

// ======================
// 🔹 Skeleton Loader
// ======================

function QuizSkeleton({ t }: { t: (key: string) => string }) {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-white flex flex-col items-center py-10 px-6">
      <div className="max-w-3xl w-full animate-pulse">
        <div className="h-8 bg-[#1E212A] rounded-md w-1/2 mx-auto mb-4" />
        <div className="h-4 bg-[#1E212A] rounded-md w-1/3 mx-auto mb-8" />
        <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6">
          <div className="h-5 bg-[#1E212A] rounded-md mb-6 w-2/3" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-[#1E212A] rounded-md w-full"></div>
            ))}
          </div>
        </div>
        <p className="text-center text-gray-400 mt-6">{t("loadingQuiz")}</p>
      </div>
    </div>
  );
}

// ======================
// 🔹 Componente principal
// ======================

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const t = useTranslations("Quiz");

  // 🔹 Busca documento + quiz
  const { data, isLoading, error } = useQuery({
    queryKey: ["document", id],
    queryFn: async (): Promise<Document> => {
      const res = await api.get(`/documents/${id}`);
      return res.data;
    },
  });

  const quiz = data?.quizzes?.[0];
  const finished = quiz && Object.keys(answers).length === quiz.questions.length;

  // 🔹 Pré-carregar imagens antes do quiz iniciar
  useEffect(() => {
    if (!quiz) return;

    const imageUrls = quiz.questions
      .filter((q) => q.kind === "IMAGE")
      .flatMap((q) => q.options.map((opt) => opt.text));

    if (imageUrls.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loaded = 0;
    const total = imageUrls.length;

    imageUrls.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === total) setImagesLoaded(true);
      };
    });
  }, [quiz]);

  if (isLoading) return <QuizSkeleton t={t} />;

  if (error || !data)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        {t("loadError")}
      </div>
    );

  if (!quiz)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        {t("noQuiz")}
      </div>
    );

  if (!imagesLoaded)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> {t("loadingImages")}
      </div>
    );

  const question = quiz.questions[currentIndex];

  // ======================
  // 🔹 Handlers
  // ======================

  const handleAnswer = (questionId: string, selectedKey: string) => {
    if (answers[questionId]) return;

    const q = quiz.questions.find((q) => q.id === questionId);
    const correctOption = q?.options.find((o) => o.isCorrect)?.key;

    setAnswers((prev) => ({ ...prev, [questionId]: selectedKey }));

    if (selectedKey === correctOption) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  // ======================
  // 🔹 UI
  // ======================

  return (
    <div className="min-h-screen bg-[#0B0D12] text-white flex flex-col items-center py-10 px-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">{quiz.topic}</h1>
        <p className="text-gray-400 text-center mb-6">
          {quiz.questions.length} {t("questions")}
        </p>

        {/* Pergunta atual */}
        <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">
            {currentIndex + 1}. {question.prompt}
          </h2>

          <div
            className={`grid ${
              question.kind === "IMAGE"
                ? "grid-cols-2 gap-4"
                : "grid-cols-1 gap-2"
            }`}
          >
            {question.options.map((option) => {
              const selected = answers[question.id] === option.key;
              const correct = option.isCorrect;
              const answered = answers[question.id] !== undefined;

              const base =
                "rounded-lg border p-3 text-sm transition cursor-pointer flex items-center justify-center text-center";
              const state = answered
                ? correct
                  ? "border-green-500 bg-green-900/20"
                  : selected
                  ? "border-red-500 bg-red-900/20"
                  : "border-[#1E212A] bg-[#0F1116]"
                : "border-[#1E212A] hover:border-blue-500 bg-[#0F1116]";

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(question.id, option.key)}
                  disabled={answered}
                  className={`${base} ${state}`}
                >
                  {question.kind === "IMAGE" ? (
                    <NextImage
                      src={option.text}
                      alt={option.key}
                      width={150}
                      height={150}
                      className="rounded-md object-cover w-full h-40"
                      priority
                    />
                  ) : (
                    <span className="text-gray-200">
                      <b>{option.key})</b> {option.text}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {answers[question.id] && (
            <div className="flex items-center mt-4">
              {question.options.find(
                (o) => o.key === answers[question.id] && o.isCorrect
              ) ? (
                <div className="flex items-center text-green-500 gap-2">
                  <CheckCircle size={18} /> {t("correct")}
                </div>
              ) : (
                <div className="flex items-center text-red-500 gap-2">
                  <XCircle size={18} /> {t("wrong")} {t("correctAnswer")}:{" "}
                  {question.options.find((o) => o.isCorrect)?.key}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navegação */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#1E212A] text-gray-300 hover:bg-[#252830] disabled:opacity-40"
          >
            <ChevronLeft size={18} /> {t("prev")}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === quiz.questions.length - 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40"
          >
            {t("next")} <ChevronRight size={18} />
          </button>
        </div>

        {/* Resultado final */}
        {finished && (
          <div className="text-center mt-8">
            <p className="text-lg font-semibold">
              🧠 {t("result", { score, total: quiz.questions.length })}
            </p>
            <p className="text-gray-400 mt-1">{t("congrats")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

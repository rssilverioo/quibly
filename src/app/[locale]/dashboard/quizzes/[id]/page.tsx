"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";
import { useGamification } from "@/hooks/useGamification";
import { CheckCircle, XCircle, Zap, RotateCcw, ArrowLeft, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  imageUrl?: string | null;
};

type Quiz = {
  id: string;
  topic: string | null;
  questions: Question[];
};

export default function QuizViewerPage() {
  const t = useTranslations("Quiz");
  const locale = useLocale();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const { user } = useAuth();
  const { awardXP } = useGamification();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<("correct" | "wrong" | "unanswered")[]>([]);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!user || !id) return;

    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/${id}`);
        setQuiz(data);
        setAnswers(new Array(data.questions?.length || 0).fill("unanswered"));
      } catch {
        console.error("Error loading quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, user]);

  const showXPToast = (points: number) => {
    setXpToast(points);
    setTimeout(() => setXpToast(null), 1200);
  };

  const handlePlayAgain = () => {
    if (!quiz) return;
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setXpEarned(0);
    setFinished(false);
    setAnswers(new Array(quiz.questions.length).fill("unanswered"));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center py-10 px-6 max-w-3xl mx-auto">
        <div className="w-full animate-pulse">
          <div className="h-8 bg-[#1E212A] rounded-md w-1/2 mx-auto mb-4" />
          <div className="h-4 bg-[#1E212A] rounded-md w-1/3 mx-auto mb-8" />
          <div className="bg-[#11141A] border border-[#1E212A] rounded-2xl p-6">
            <div className="h-5 bg-[#1E212A] rounded-md mb-6 w-2/3" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-[#1E212A] rounded-xl w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400">
        {t("noQuiz")}
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const isPerfect = score === quiz.questions.length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[70vh] text-center px-4"
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
          isPerfect ? "bg-yellow-500/10" : "bg-green-500/10"
        }`}>
          {isPerfect ? (
            <Trophy size={36} className="text-yellow-400" />
          ) : (
            <CheckCircle size={36} className="text-green-500" />
          )}
        </div>

        {isPerfect && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-400 text-sm font-medium mb-2"
          >
            {t("perfectScore")}
          </motion.p>
        )}

        <h2 className="text-3xl font-bold mb-2">
          {t("result", { score, total: quiz.questions.length })}
        </h2>

        <div className="flex items-center gap-2 text-yellow-400 text-xl mb-3">
          <Zap size={22} />
          <span className="font-bold">+{xpEarned} XP</span>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <span className="text-gray-400 text-sm">{t("accuracy")}:</span>
          <span className={`text-lg font-bold ${percentage >= 70 ? "text-green-400" : "text-orange-400"}`}>
            {percentage}%
          </span>
        </div>

        {/* Progress bubbles */}
        <div className="flex gap-1.5 mb-8">
          {answers.map((answer, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                answer === "correct"
                  ? "bg-green-500"
                  : answer === "wrong"
                  ? "bg-red-500"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        <p className="text-gray-400 mb-8">{t("congrats")}</p>

        <div className="flex gap-3">
          <button
            onClick={handlePlayAgain}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition"
          >
            <RotateCcw size={16} />
            {t("playAgain")}
          </button>
          <Link
            href={`/${locale}/dashboard/quizzes`}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E212A] hover:bg-[#252830] text-gray-300 rounded-xl text-sm font-medium transition"
          >
            <ArrowLeft size={16} />
            {t("backDashboard")}
          </Link>
        </div>
      </motion.div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[currentIndex];

  if (!question || totalQuestions === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400">
        {t("noQuiz")}
      </div>
    );
  }

  const handleSelectOption = async (optionIndex: number) => {
    if (answered) return;

    setSelectedOption(optionIndex);
    setAnswered(true);

    const isCorrect = optionIndex === question.correctIndex;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = isCorrect ? "correct" : "wrong";
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      const result = await awardXP("quiz_correct");
      if (result) {
        setXpEarned((prev) => prev + result.pointsAwarded);
        showXPToast(result.pointsAwarded);
      }
    } else {
      const result = await awardXP("quiz_wrong");
      if (result) {
        setXpEarned((prev) => prev + result.pointsAwarded);
        showXPToast(result.pointsAwarded);
      }
    }

    setTimeout(() => {
      if (currentIndex + 1 >= totalQuestions) {
        setFinished(true);
        const finalScore = isCorrect ? score + 1 : score;
        if (finalScore / totalQuestions > 0.7) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
      } else {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-3 text-center">{quiz.topic || "Quiz"}</h1>

      {/* Progress bubbles */}
      <div className="flex gap-1.5 mb-4">
        {answers.map((answer, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-blue-500 scale-125"
                : answer === "correct"
                ? "bg-green-500"
                : answer === "wrong"
                ? "bg-red-500"
                : "bg-gray-700"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {currentIndex + 1} / {totalQuestions}
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

      {/* Question with slide animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.25 }}
          className="w-full bg-[#11141A] border border-[#1E212A] rounded-2xl p-6 mb-6"
        >
          {question.imageUrl && (
            <div className="flex justify-center mb-4">
              <Image
                src={question.imageUrl}
                alt=""
                width={200}
                height={140}
                className="w-auto max-h-36 object-contain rounded-lg"
                unoptimized
              />
            </div>
          )}

          <h2 className="text-lg font-medium mb-6">
            {currentIndex + 1}. {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;

              let borderColor = "border-[#1E212A]";
              let bgColor = "bg-[#0F1116]";

              if (answered) {
                if (isCorrect) {
                  borderColor = "border-green-500";
                  bgColor = "bg-green-900/20";
                } else if (isSelected && !isCorrect) {
                  borderColor = "border-red-500";
                  bgColor = "bg-red-900/20";
                }
              } else if (isSelected) {
                borderColor = "border-blue-500";
              }

              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectOption(idx)}
                  disabled={answered}
                  className={`w-full text-left rounded-xl border p-4 text-sm transition-all flex items-center gap-3 ${borderColor} ${bgColor} ${
                    !answered ? "hover:border-blue-500 cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span className="w-8 h-8 rounded-full border border-[#2A2E38] flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-gray-200 flex-1">{option}</span>
                  {answered && isCorrect && (
                    <CheckCircle size={18} className="ml-auto text-green-500 shrink-0" />
                  )}
                  {answered && isSelected && !isCorrect && (
                    <XCircle size={18} className="ml-auto text-red-500 shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-4"
              >
                {selectedOption === question.correctIndex ? (
                  <div className="flex items-center text-green-500 gap-2 text-sm">
                    <CheckCircle size={16} /> {t("correct")}
                  </div>
                ) : (
                  <div className="flex items-center text-red-500 gap-2 text-sm">
                    <XCircle size={16} /> {t("wrong")}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* XP earned */}
      {xpEarned > 0 && (
        <div className="flex items-center gap-2 text-yellow-400 text-sm">
          <Zap size={16} />
          <span className="font-semibold">+{xpEarned} XP</span>
        </div>
      )}
    </div>
  );
}

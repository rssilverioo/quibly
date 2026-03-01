"use client";

import { motion } from "framer-motion";
import { Layers, HelpCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  type: "flashcards" | "quizzes";
  title: string;
  date: string;
  count?: number;
  href: string;
  actionLabel: string;
};

export default function StudyCard({ type, title, date, count, href, actionLabel }: Props) {
  const isFlashcard = type === "flashcards";
  const accentColor = isFlashcard ? "blue" : "green";
  const Icon = isFlashcard ? Layers : HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={href}
        className={`block bg-[#11141A] border border-[#1E212A] rounded-2xl p-5 transition-all duration-200 hover:border-${accentColor}-500/50 hover:shadow-[0_0_20px_rgba(${isFlashcard ? "59,130,246" : "34,197,94"},0.1)]`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon size={18} className={`text-${accentColor}-500`} />
          <h3 className="font-semibold text-white line-clamp-1 text-sm">{title}</h3>
        </div>
        <p className="text-gray-500 text-xs mb-4">
          {new Date(date).toLocaleDateString()}
          {count != null && (
            <span className="ml-2 text-gray-400">({count} cards)</span>
          )}
        </p>
        <span
          className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium ${
            isFlashcard
              ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
              : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
          } transition`}
        >
          {actionLabel}
        </span>
      </Link>
    </motion.div>
  );
}

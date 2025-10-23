"use client";

import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DocumentItem = {
  id: string;
  title: string;
  hasFlashcards: boolean;
  hasQuizzes: boolean;
};

export default function HomePage() {
  const t = useTranslations("Home");
  const toastT = useTranslations("Toasts");
  const locale = useLocale();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  // 🔹 Carrega documentos do usuário autenticado
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setLoading(false);

      try {
        const { data } = await api.get<DocumentItem[]>("/documents", {
          headers: { Authorization: `Bearer ${await user.getIdToken()}` },
        });
        setDocuments(data);
      } catch (err) {
        console.error("❌ Erro ao carregar documentos:", err);
        toast.error(toastT("loadError"));
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [toastT]);

  // 🔹 Excluir documento
  const handleDelete = (id: string) => {
    const tId = toast.warning("🗑️ Deseja realmente excluir este documento?", {
      duration: 5000,
      action: {
        label: "Excluir",
        onClick: async () => {
          const user = auth.currentUser;
          if (!user) {
            toast.error("⚠️ " + toastT("unauthenticated"));
            return;
          }

          try {
            setDeleting(id);
            const token = await user.getIdToken(true);
            await api.delete(`/documents/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
            toast.success("✅ " + toastT("deletedSuccess"));
          } catch (err) {
            console.error("❌ Erro ao excluir documento:", err);
            toast.error("❌ " + toastT("deleteError"));
          } finally {
            setDeleting(null);
          }

          toast.dismiss(tId);
        },
      },
      cancel: { label: "Cancelar", onClick: () => toast.dismiss(tId) },
    });
  };

  // 🔹 Geração de conteúdo (Quiz / Flashcards)
  const handleGenerate = async (type: "quiz" | "flashcards", id: string) => {
    const user = auth.currentUser;
    if (!user) return toast.error(toastT("unauthenticated"));

    try {
      setProcessing(id);
      const token = await user.getIdToken(true);
      const endpoint =
        type === "quiz" ? "/documents/process" : "/documents/flashcards";

      await api.post(
        endpoint,
        { documentId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        type === "quiz"
          ? t("quizGeneratedSuccess")
          : t("flashcardsGeneratedSuccess")
      );

      // Atualiza lista
      const { data } = await api.get<DocumentItem[]>("/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(data);
    } catch (err) {
      console.error("❌ Erro ao gerar:", err);
      toast.error(t("generationError"));
    } finally {
      setProcessing(null);
    }
  };

  // 🔹 Loading
  if (loading)
    return (
      <div className="min-h-screen bg-[#0B0D12] text-white p-8">
        <h1 className="text-3xl font-bold mb-6">{t("myDocuments")}</h1>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#11141A] border border-[#1E212A] rounded-xl p-5 animate-pulse"
            >
              <div className="h-5 bg-[#1E212A] rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-[#1E212A] rounded w-1/2 mb-6"></div>
              <div className="h-8 bg-[#1E212A] rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );

  // 🔹 Vazio
  if (documents.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
        <p className="text-lg mb-2">{t("emptyTitle")}</p>
        <p className="text-sm text-gray-500">{t("emptyDesc")}</p>
      </div>
    );

  // 🔹 Render principal
  return (
    <div className="min-h-screen bg-[#0B0D12] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">{t("myDocuments")}</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="relative bg-[#11141A] border border-[#1E212A] rounded-xl p-5 hover:border-blue-600 transition flex flex-col justify-between group"
          >
            {/* Botão excluir */}
            <button
              onClick={() => handleDelete(doc.id)}
              disabled={deleting === doc.id}
              className="absolute top-3 right-3 text-red-500 hover:text-red-400 transition disabled:opacity-50"
              title={t("deleteBtn")}
            >
              {deleting === doc.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </button>

            {/* Info */}
            <div>
              <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2 pr-6">
                {doc.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {doc.hasFlashcards || doc.hasQuizzes
                  ? t("readyToView")
                  : t("readyToGenerate")}
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-2 mt-auto">
              {/* FLASHCARDS */}
              {doc.hasFlashcards ? (
                <a
                  href={`/${locale}/dashboard/flashcards/${doc.id}`}
                  className="flex-1 py-1.5 rounded-lg text-sm font-medium text-center bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {t("viewFlashcards")}
                </a>
              ) : (
                <button
                  onClick={() => handleGenerate("flashcards", doc.id)}
                  disabled={processing === doc.id}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium text-center ${
                    processing === doc.id
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {processing === doc.id ? (
                    <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                  ) : (
                    t("generateFlashcards")
                  )}
                </button>
              )}

              {/* QUIZ */}
              {doc.hasQuizzes ? (
                <a
                  href={`/${locale}/dashboard/quizzes/${doc.id}`}
                  className="flex-1 py-1.5 rounded-lg text-sm font-medium text-center bg-green-600 hover:bg-green-700 text-white"
                >
                  {t("viewQuiz")}
                </a>
              ) : (
                <button
                  onClick={() => handleGenerate("quiz", doc.id)}
                  disabled={processing === doc.id}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium text-center ${
                    processing === doc.id
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {processing === doc.id ? (
                    <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                  ) : (
                    t("generateQuiz")
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

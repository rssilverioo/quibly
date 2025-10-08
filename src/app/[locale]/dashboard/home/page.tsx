"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useTranslations, useLocale } from "next-intl";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type DocumentItem = {
  id: string;
  title: string;
  flashcardSetsCount: number;
  quizzesCount: number;
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

  // 🔹 Função para excluir documento
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

        // Fecha o toast de confirmação
        toast.dismiss(tId);
      },
    },
    cancel: {
      label: "Cancelar",
      onClick: () => toast.dismiss(tId),
    },
  });
};
  // 🔹 Skeleton de carregamento
  if (loading)
    return (
      <div className="min-h-screen bg-[#0B0D12] text-white p-8">
        <h1 className="text-3xl font-bold mb-6">{t("myDocuments")}</h1>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#11141A] border border-[#1E212A] rounded-xl p-5 flex flex-col justify-between animate-pulse"
            >
              <div>
                <div className="h-5 bg-[#1E212A] rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-[#1E212A] rounded w-1/2 mb-6"></div>
              </div>
              <div className="flex gap-2 mt-auto">
                <div className="flex-1 h-8 bg-[#1E212A] rounded-lg"></div>
                <div className="flex-1 h-8 bg-[#1E212A] rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // 🔹 Caso vazio
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
            {/* Botão de exclusão */}
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

            <div>
              <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2 pr-6">
                {doc.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {doc.flashcardSetsCount} {t("flashcards")},{" "}
                {doc.quizzesCount} {t("quizzes")}
              </p>
            </div>

            <div className="flex gap-2 mt-auto">
              <a
                href={`/${locale}/dashboard/flashcards/${doc.id}`}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium text-center transition ${
                  doc.hasFlashcards
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-[#1E212A] text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("flashcardsBtn")}
              </a>

              <a
                href={`/${locale}/dashboard/quizzes/${doc.id}`}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium text-center transition ${
                  doc.hasQuizzes
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-[#1E212A] text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("quizBtn")}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

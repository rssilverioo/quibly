"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";

export default function UploadPage() {
  const t = useTranslations("Upload");
  const toastT = useTranslations("Toasts");
  const locale = useLocale();

  // ======= STATES =======
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);
  const [generatingType, setGeneratingType] = useState<"quiz" | "flashcards" | null>(null);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [flashcardsGenerated, setFlashcardsGenerated] = useState(false);

  // ======= DROPZONE =======
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdf = acceptedFiles[0];
      if (pdf && pdf.type === "application/pdf") {
        setFile(pdf);
        setProgress(0);
      } else {
        toast.error(t("invalidFile"));
      }
    },
    [t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  });

  // ======= UPLOAD =======
  const handleUpload = async () => {
    if (!file) return toast.error(t("noFile"));
    if (!title.trim()) return toast.error(t("missingTitle"));

    setUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error(toastT("unauthenticated"));

      const token = await user.getIdToken(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());

      const res = await api.post("/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (p) =>
          setProgress(Math.round((p.loaded * 100) / (p.total ?? 1))),
      });

      const uploadedId = res.data.id;
      if (!uploadedId) throw new Error("Erro ao obter ID do documento.");
      setUploadedDocId(uploadedId);

      // Processa conteúdo (extração de texto)
      setProcessing(true);
      await api.post(
        "/documents/extract",
        { documentId: uploadedId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(t("uploadSuccess"));
    } catch (err) {
      console.error("❌ Erro no upload:", err);
      toast.error(t("error"));
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  // ======= GENERATE =======
  const handleGenerate = async (type: "quiz" | "flashcards") => {
    if (!uploadedDocId || generatingType) return;
    setGeneratingType(type);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error(toastT("unauthenticated"));
      const token = await user.getIdToken(true);
      const endpoint = type === "quiz" ? "/documents/process" : "/documents/flashcards";

      await api.post(
        endpoint,
        { documentId: uploadedDocId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (type === "quiz") {
        setQuizGenerated(true);
        toast.success(t("quizGenerated"));
      } else {
        setFlashcardsGenerated(true);
        toast.success(t("flashcardsGenerated"));
      }
    } catch (err) {
      console.error("❌ Erro ao gerar conteúdo:", err);
      toast.error(t("generationError"));
    } finally {
      setGeneratingType(null);
    }
  };

  // ======= RENDER =======
  return (
    <div className="relative min-h-screen bg-[#0B0D12] text-white flex flex-col items-center py-10 px-6">
      {/* Overlay global */}
      {generatingType && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-300">
              {generatingType === "quiz" ? t("generatingQuiz") : t("generatingFlashcards")}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">{t("title")}</h1>
        <p className="text-gray-400 text-center mb-8">{t("subtitle")}</p>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition ${
            isDragActive
              ? "border-blue-600 bg-[#11141A]/50"
              : "border-[#1E212A] bg-[#11141A]"
          }`}
        >
          <input {...getInputProps()} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 mb-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 15a4 4 0 004 4h10a4 4 0 004-4m-7-8v8m0 0l-3-3m3 3l3-3"
            />
          </svg>

          <p className="text-gray-300 text-center">
            {isDragActive ? t("dropHere") : t("dragDrop")}
          </p>
          <p className="text-sm text-gray-500 mt-1">{t("orClick")}</p>
        </div>

        {/* Título e Upload */}
        {file && (
          <div className="bg-[#11141A] border border-[#1E212A] rounded-lg p-4 mt-6">
            <label className="block text-sm text-gray-400 mb-2">{t("documentTitle")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
              className="w-full bg-[#0B0D12] border border-[#1E212A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
            />

            {/* Progresso */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-xs font-bold">
                  PDF
                </div>
                <p className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</p>
              </div>
              <p className="text-sm text-gray-400">{progress}%</p>
            </div>

            <div className="w-full bg-[#1E212A] h-2 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || processing}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 text-sm font-medium disabled:opacity-50"
            >
              {uploading
                ? t("uploading")
                : processing
                ? t("processing")
                : t("uploadBtn")}
            </button>
          </div>
        )}

        {/* Botões de geração */}
        {uploadedDocId && !uploading && !processing && (
          <div className="flex justify-center gap-4 mt-6">
            {quizGenerated ? (
              <Link
                href={`/${locale}/dashboard/quizzes/${uploadedDocId}`}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                {t("viewQuiz")}
              </Link>
            ) : (
              <button
                onClick={() => handleGenerate("quiz")}
                disabled={!!generatingType}
                className={`px-5 py-2 rounded-lg font-medium text-white flex items-center justify-center gap-2 ${
                  generatingType ? "bg-blue-800 opacity-60 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {generatingType === "quiz" && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {generatingType === "quiz" ? t("generatingQuiz") : t("generateQuiz")}
              </button>
            )}

            {flashcardsGenerated ? (
              <Link
                href={`/${locale}/dashboard/flashcards/${uploadedDocId}`}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                {t("viewFlashcards")}
              </Link>
            ) : (
              <button
                onClick={() => handleGenerate("flashcards")}
                disabled={!!generatingType}
                className={`px-5 py-2 rounded-lg font-medium text-white flex items-center justify-center gap-2 ${
                  generatingType
                    ? "bg-indigo-800 opacity-60 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {generatingType === "flashcards" && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {generatingType === "flashcards" ? t("generatingFlashcards") : t("generateFlashcards")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

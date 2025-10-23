"use client";

import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

type User = {
  id: string;
  plan: "FREE" | "PREMIUM";
  documents?: { id: string; title: string }[];
};

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
  const [user, setUser] = useState<User | null>(null);

  // ======= FETCH USER =======
  useEffect(() => {
    const fetchUser = async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;

      try {
        const token = await firebaseUser.getIdToken(true);
        const { data } = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.error("❌ Erro ao buscar usuário:", err);
      }
    };
    fetchUser();
  }, []);

  // ======= Limitação do plano =======
  const hasReachedLimit =
    user?.plan === "FREE" && (user?.documents?.length ?? 0) >= 1;

  // ======= DROPZONE =======
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (hasReachedLimit) return; // bloqueia drop
      const pdf = acceptedFiles[0];
      if (pdf && pdf.type === "application/pdf") {
        setFile(pdf);
        setProgress(0);
      } else {
        toast.error(t("invalidFile"));
      }
    },
    [t, hasReachedLimit]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    disabled: hasReachedLimit, // bloqueia input
  });

  // ======= UPLOAD =======
  const handleUpload = async () => {
    if (hasReachedLimit) return; // garante backend-safe
    if (!file) return toast.error(t("noFile"));
    if (!title.trim()) return toast.error(t("missingTitle"));

    setUploading(true);
    try {
      const userAuth = auth.currentUser;
      if (!userAuth) throw new Error(toastT("unauthenticated"));

      const token = await userAuth.getIdToken(true);
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
      setUploadedDocId(uploadedId);

      // Processa conteúdo (extração de texto)
      setProcessing(true);
      await api.post(
        "/documents/extract",
        { documentId: uploadedId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("❌ Erro no upload:", err);
      toast.error(t("error"));
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  // ======= RENDER =======
  return (
    <div className="relative min-h-screen bg-[#0B0D12] text-white flex flex-col items-center py-10 px-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">{t("title")}</h1>
        <p className="text-gray-400 text-center mb-8">{t("subtitle")}</p>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition ${
            hasReachedLimit
              ? "border-gray-700 bg-[#11141A]/40 cursor-not-allowed"
              : isDragActive
              ? "border-blue-600 bg-[#11141A]/50"
              : "border-[#1E212A] bg-[#11141A]"
          }`}
        >
          <input {...getInputProps()} disabled={hasReachedLimit} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-10 h-10 mb-4 ${
              hasReachedLimit ? "text-gray-600" : "text-gray-500"
            }`}
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

          {hasReachedLimit ? (
            <p className="text-gray-500 text-center font-medium">
              🚫 Limite atingido no plano Free (1 documento).
              <br />
              <span className="text-gray-400 text-sm">
                Faça upgrade para continuar.
              </span>
            </p>
          ) : (
            <>
              <p className="text-gray-300 text-center">
                {isDragActive ? t("dropHere") : t("dragDrop")}
              </p>
              <p className="text-sm text-gray-500 mt-1">{t("orClick")}</p>
            </>
          )}
        </div>

        {/* Título e Upload */}
        {file && !hasReachedLimit && (
          <div className="bg-[#11141A] border border-[#1E212A] rounded-lg p-4 mt-6">
            <label className="block text-sm text-gray-400 mb-2">
              {t("documentTitle")}
            </label>
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
                <p className="text-sm text-gray-300 truncate max-w-[200px]">
                  {file.name}
                </p>
              </div>
              <p className="text-sm text-gray-400">{progress}%</p>
            </div>

            <div className="w-full bg-[#1E212A] h-2 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || processing || hasReachedLimit}
              className={`w-full rounded-lg py-2 text-sm font-medium transition ${
                hasReachedLimit
                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {hasReachedLimit
                ? "Limite atingido (plano Free)"
                : uploading
                ? t("uploading")
                : processing
                ? t("processing")
                : t("uploadBtn")}
            </button>
          </div>
        )}

        {/* Mensagem de upgrade */}
        {hasReachedLimit && (
          <div className="text-center mt-6">
            <Link
              href={`/${locale}/subscribe`}
              className="text-blue-500 hover:underline text-sm"
            >
              🌟 Faça upgrade para o Quibly Pro
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

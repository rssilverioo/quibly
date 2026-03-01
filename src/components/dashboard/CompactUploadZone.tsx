"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

type Props = {
  onUploadComplete?: (docId: string) => void;
  onGenerateComplete?: (id: string) => void;
  autoGenerate?: "flashcards" | "quiz";
  disabled?: boolean;
  limitReached?: boolean;
};

type Step = "idle" | "uploading" | "processing" | "generating" | "done";

export default function CompactUploadZone({
  onUploadComplete,
  onGenerateComplete,
  autoGenerate,
  disabled,
  limitReached,
}: Props) {
  const t = useTranslations("Upload");

  const [expanded, setExpanded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>("idle");

  const isProcessing = step === "uploading" || step === "processing" || step === "generating";

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (limitReached || disabled) return;
      const pdf = acceptedFiles[0];
      if (pdf && pdf.type === "application/pdf") {
        setFile(pdf);
        setExpanded(true);
        setProgress(0);
        setStep("idle");
      } else {
        toast.error(t("invalidFile"));
      }
    },
    [t, limitReached, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    disabled: limitReached || disabled,
    noClick: expanded,
  });

  const handleUpload = async () => {
    if (!file) return toast.error(t("noFile"));
    if (!title.trim()) return toast.error(t("missingTitle"));

    setStep("uploading");
    try {
      const userAuth = auth.currentUser;
      if (!userAuth) throw new Error("Unauthenticated");

      const token = await userAuth.getIdToken(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());

      // Step 1: Upload
      const res = await api.post("/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (p) =>
          setProgress(Math.round((p.loaded * 100) / (p.total ?? 1))),
      });

      const uploadedId = res.data.id;

      // Step 2: Extract
      setStep("processing");
      await api.post(
        "/documents/extract",
        { documentId: uploadedId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUploadComplete?.(uploadedId);

      // Step 3: Auto-generate (if enabled)
      if (autoGenerate) {
        setStep("generating");
        const endpoint =
          autoGenerate === "quiz" ? "/generate/quiz" : "/generate/flashcards";
        const genRes = await api.post(endpoint, { documentId: uploadedId });

        const generatedId =
          autoGenerate === "quiz"
            ? genRes.data.quiz?.id
            : genRes.data.flashcardSet?.id;

        toast.success(t("generated"));
        onGenerateComplete?.(generatedId);
      } else {
        toast.success(t("uploadSuccess"));
      }

      setStep("done");

      // Reset after a moment
      setTimeout(() => {
        setFile(null);
        setTitle("");
        setExpanded(false);
        setStep("idle");
        setProgress(0);
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 429) {
        toast.error(t("limitReached"));
      } else {
        toast.error(t("error"));
      }
      setStep("idle");
    }
  };

  const stepLabel = () => {
    switch (step) {
      case "uploading":
        return t("uploading");
      case "processing":
        return t("processing");
      case "generating":
        return autoGenerate === "quiz"
          ? t("generatingQuiz")
          : t("generatingFlashcards");
      case "done":
        return t("generated");
      default:
        return t("uploadBtn");
    }
  };

  if (limitReached) {
    return (
      <div className="border border-dashed border-[#1E212A] rounded-2xl p-4 text-center opacity-60">
        <p className="text-sm text-gray-500">{t("limitReached")}</p>
        <p className="text-xs text-gray-600 mt-1">{t("upgradeHint")}</p>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl transition-all duration-300 ${
        isDragActive
          ? "border-blue-500 bg-blue-500/5"
          : expanded
          ? "border-[#1E212A] bg-[#11141A]"
          : "border-[#1E212A] hover:border-gray-600 cursor-pointer"
      }`}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 p-4"
          >
            <Upload size={18} className="text-gray-500" />
            <span className="text-sm text-gray-400">
              {isDragActive ? t("dropHere") : t("dragDrop")}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* File info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-xs font-bold text-white shrink-0">
                PDF
              </div>
              <p className="text-sm text-gray-300 truncate flex-1">{file?.name}</p>
              {step === "done" && <CheckCircle size={18} className="text-green-500 shrink-0" />}
            </div>

            {/* Title input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
              className="w-full bg-[#0B0D12] border border-[#1E212A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
              disabled={isProcessing}
            />

            {/* Progress */}
            {isProcessing && (
              <div className="w-full bg-[#1E212A] h-1.5 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      step === "uploading"
                        ? `${progress}%`
                        : step === "processing"
                        ? "60%"
                        : "90%",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={isProcessing || step === "done"}
              className="w-full rounded-xl py-2.5 text-sm font-medium transition bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {stepLabel()}
                </>
              ) : step === "done" ? (
                <>
                  <CheckCircle size={16} />
                  {stepLabel()}
                </>
              ) : (
                <>
                  <Upload size={16} />
                  {stepLabel()}
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

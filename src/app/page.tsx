"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

type DocumentItem = {
  id: string;
  title: string;
  flashcardSetsCount: number;
  quizzesCount: number;
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // 🔹 Busca documentos do usuário
  async function fetchDocuments() {
    setLoadingData(true);
    try {
      const { data } = await api.get("/documents");
      setDocuments(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar documentos.");
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    if (user) fetchDocuments();
  }, [user]);

  async function handleLogout() {
    await signOut(auth);
  }

  if (loading) return <p className="p-6 text-center">Carregando...</p>;
  if (!user)
    return <p className="p-6 text-center">Você precisa fazer login.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">📚 Meus Documentos</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>

      {/* DOCUMENTOS */}
      {loadingData && <p>Carregando...</p>}

      {!loadingData && documents.length === 0 && (
        <p className="text-gray-500">Nenhum documento encontrado.</p>
      )}

      <div className="grid gap-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg">{doc.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Flashcards: {doc.flashcardSetsCount} | Quizzes:{" "}
              {doc.quizzesCount}
            </p>

            <div className="flex gap-2 mt-3">
              {doc.flashcardSetsCount > 0 && (
                <button
                  onClick={() => router.push(`/study/flashcards/${doc.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Estudar Flashcards
                </button>
              )}
              {doc.quizzesCount > 0 && (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded opacity-70 cursor-not-allowed"
                  disabled
                >
                  Quizzes (em breve)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

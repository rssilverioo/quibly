"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const locale = useLocale();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Por favor, insira seu nome.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
            router.push(`/${locale}/dashboard/home`);

    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("E-mail já cadastrado.");
      } else {
        setError("Erro ao registrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard/home");
    } catch (err) {
      setError("Erro ao registrar com Google.");
    }
  };

  return (
    <div className="flex flex-col gap-6 text-gray-200">
      {/* Logo + Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          Quibly <span className="text-blue-500 text-4xl">📘</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Crie sua conta e transforme seus PDFs em aprendizado.
        </p>
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2 bg-[#1E212A] hover:bg-[#242832] border border-[#2A2E38] text-white py-2 rounded-lg transition"
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
          fill="currentColor"
        >
          <path d="M488 261.8c0-17.8-1.5-35.1-4.3-52H249v98h135.6c-5.8 31.4-23 57.9-49.1 75.9v62h79.4c46.5-42.8 73.1-106 73.1-183.9z" />
          <path d="M249 492c66.1 0 121.4-21.9 161.9-59.3l-79.4-62c-22 14.7-50.2 23.4-82.5 23.4-63.5 0-117.3-42.8-136.5-100.4h-81v63.1C71 439.6 152.9 492 249 492z" />
          <path d="M112.5 293.7c-4.6-13.7-7.2-28.3-7.2-43.7s2.6-30 7.2-43.7v-63.1h-81C15.4 179.9 0 213.4 0 250s15.4 70.1 31.5 106.8l81-63.1z" />
          <path d="M249 97.6c35.9 0 68.1 12.4 93.4 36.7l69.8-69.8C370.4 26.5 315.1 4 249 4 152.9 4 71 56.4 31.5 143.2l81 63.1C131.7 140.4 185.5 97.6 249 97.6z" />
        </svg>
        Registrar com Google
      </button>

      <div className="relative text-center">
        <div className="absolute inset-x-0 top-1/2 border-t border-[#1E212A]" />
        <span className="bg-[#11141A] text-gray-500 text-sm px-3 relative z-10">ou</span>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1E212A] border border-[#2A2E38] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1E212A] border border-[#2A2E38] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1E212A] border border-[#2A2E38] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
        >
          {loading ? "Criando conta..." : "Registrar"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-400">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}

"use client";

import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FaFacebook } from "react-icons/fa";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const syncUser = async (token: string, name?: string) => {
    try {
      await api.post(
        "/auth/sync",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.warn("Failed to sync user:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      await syncUser(token, cred.user.displayName || undefined);

      toast.success(t("loginSuccess"));
      router.push(`/${locale}/dashboard/home`);
    } catch {
      toast.error(t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const token = await cred.user.getIdToken();
      await syncUser(token, cred.user.displayName || undefined);

      toast.success(t("googleSuccess"));
      router.push(`/${locale}/dashboard/home`);
    } catch {
      toast.error(t("googleError"));
    }
  };

  const handleFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const token = await cred.user.getIdToken();
      await syncUser(token, cred.user.displayName || undefined);

      toast.success(t("facebookSuccess"));
      router.push(`/${locale}/dashboard/home`);
    } catch {
      toast.error(t("facebookError"));
    }
  };

  return (
    <div className="flex flex-col gap-6 text-gray-200">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Image src="/favicon.svg" alt="Logo" width={50} height={50} />
        </h1>
        <p className="text-gray-400 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#1E212A] hover:bg-[#242832] border border-[#2A2E38] text-white py-2 rounded-lg transition disabled:opacity-50"
      >
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill="currentColor">
          <path d="M488 261.8c0-17.8-1.5-35.1-4.3-52H249v98h135.6c-5.8 31.4-23 57.9-49.1 75.9v62h79.4c46.5-42.8 73.1-106 73.1-183.9z" />
          <path d="M249 492c66.1 0 121.4-21.9 161.9-59.3l-79.4-62c-22 14.7-50.2 23.4-82.5 23.4-63.5 0-117.3-42.8-136.5-100.4h-81v63.1C71 439.6 152.9 492 249 492z" />
          <path d="M112.5 293.7c-4.6-13.7-7.2-28.3-7.2-43.7s2.6-30 7.2-43.7v-63.1h-81C15.4 179.9 0 213.4 0 250s15.4 70.1 31.5 106.8l81-63.1z" />
          <path d="M249 97.6c35.9 0 68.1 12.4 93.4 36.7l69.8-69.8C370.4 26.5 315.1 4 249 4 152.9 4 71 56.4 31.5 143.2l81 63.1C131.7 140.4 185.5 97.6 249 97.6z" />
        </svg>
        {t("loginGoogle")}
      </button>

      {/* Facebook Button */}
      <button
        type="button"
        onClick={handleFacebook}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white py-2 rounded-lg transition disabled:opacity-50"
      >
        <FaFacebook className="w-5 h-5" />
        {t("loginFacebook")}
      </button>

      {/* Divider */}
      <div className="relative text-center">
        <div className="absolute inset-x-0 top-1/2 border-t border-[#1E212A]" />
        <span className="bg-[#11141A] text-gray-500 text-sm px-3 relative z-10">
          {t("or")}
        </span>
      </div>

      {/* Email Login */}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#1E212A] border border-[#2A2E38] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1E212A] border border-[#2A2E38] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium disabled:opacity-50"
        >
          {loading ? t("loading") : t("login")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400">
        {t("noAccount")}{" "}
        <Link href={`/${locale}/register`} className="text-blue-500 hover:underline">
          {t("register")}
        </Link>
      </p>
    </div>
  );
}

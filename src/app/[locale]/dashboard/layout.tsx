"use client";

import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import clsx from "clsx";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  CreditCard,
  Crown,
  Globe,
  Home,
  Layers,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import XPProgressBar from "@/components/dashboard/XPProgressBar";
import StreakBadge from "@/components/dashboard/StreakBadge";
import LevelBadge from "@/components/dashboard/LevelBadge";

type UserData = {
  plan: "FREE" | "PRO";
  xp: number;
  streak: number;
  level: string;
  photoUrl?: string | null;
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData>({
    plan: "FREE",
    xp: 0,
    streak: 0,
    level: "Iniciante",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push(`/${locale}/login`);
        return;
      }

      setUser(currentUser);

      try {
        const { data } = await api.get("/users/me");
        setUserData({
          plan: data.plan || "FREE",
          xp: data.xp || 0,
          streak: data.streak || 0,
          level: data.level || "Iniciante",
          photoUrl: data.photoUrl,
        });
      } catch {
        toast.error("Error loading user data");
      }

      setCheckingAuth(false);
    });

    return () => unsub();
  }, [router, locale]);

  const navItems = [
    {
      name: t("home"),
      href: `/${locale}/dashboard/home`,
      icon: <Home size={18} />,
    },
    {
      name: "Flashcards",
      href: `/${locale}/dashboard/flashcards`,
      icon: <Layers size={18} />,
    },
    {
      name: "Quizzes",
      href: `/${locale}/dashboard/quizzes`,
      icon: <HelpCircle size={18} />,
    },
    {
      name: userData.plan === "PRO" ? "PRO" : "Pricing",
      href: `/${locale}/dashboard/pricing`,
      icon:
        userData.plan === "PRO" ? (
          <Crown size={18} className="text-yellow-400" />
        ) : (
          <CreditCard size={18} />
        ),
    },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push(`/${locale}/login`);
  };

  const changeLanguage = (lang: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${lang}`);
    router.push(newPath);
    setLangMenuOpen(false);
  };

  const languages = [
    { code: "en", label: "English", flag: "US" },
    { code: "pt", label: "Portugues", flag: "BR" },
  ];

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0D12] text-gray-400">
        <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
        {t("checkingAuth")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] text-white flex flex-col">
      {/* Top HUD — logo + stats + controls */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#1E212A]">
        {/* Logo */}
        <Link href={`/${locale}/dashboard/home`} className="flex items-center gap-2 shrink-0">
          <Image src="/logoquibly.svg" alt="Logo" width={100} height={100} />
        </Link>

        {/* Stats — center */}
        <div className="hidden md:flex items-center gap-3">
          <XPProgressBar xp={userData.xp} level={userData.level} compact />
          <StreakBadge streak={userData.streak} compact />
          <LevelBadge level={userData.level} compact />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 relative">
          {/* Language */}
          <button
            onClick={() => setLangMenuOpen((prev) => !prev)}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition"
          >
            <Globe size={18} />
          </button>

          {langMenuOpen && (
            <div className="absolute top-10 right-16 bg-[#11141A] border border-[#1E212A] rounded-lg shadow-lg w-40 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={clsx(
                    "flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#1E212A]",
                    locale === lang.code ? "text-blue-500" : "text-gray-300"
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Avatar */}
          {user && (
            <Image
              src={userData.photoUrl || user.photoURL || "https://i.pravatar.cc/40"}
              alt="Avatar"
              width={36}
              height={36}
              className="rounded-full border border-[#1E212A]"
            />
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-400 hover:text-red-500 transition"
            title={t("logout")}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 pb-28">{children}</main>

      {/* Stats row above bottom nav (mobile only) */}
      <div className="md:hidden fixed bottom-[60px] left-0 right-0 bg-[#0B0D12]/95 border-t border-[#1E212A] px-4 py-2 flex items-center justify-center gap-4 backdrop-blur-lg">
        <XPProgressBar xp={userData.xp} level={userData.level} compact />
        <StreakBadge streak={userData.streak} compact />
        <LevelBadge level={userData.level} compact />
      </div>

      {/* Bottom nav — always visible, game-style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0B0D12]/95 border-t border-[#1E212A] backdrop-blur-lg z-50">
        <div className="max-w-md mx-auto flex justify-around py-3">
          {navItems.map((item) => {
            const active = pathname.includes(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center text-xs transition gap-1",
                  active ? "text-blue-500" : "text-gray-400 hover:text-white"
                )}
              >
                <div className={clsx(
                  "p-2 rounded-xl transition",
                  active && "bg-blue-600/15"
                )}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

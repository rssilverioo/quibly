"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ReactNode, useState, useEffect } from "react";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Globe, LogOut, Home, FileText, Upload, Users } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 🔒 Verifica login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push(`/${locale}/login`);
      } else {
        setUser(currentUser);
      }
      setCheckingAuth(false);
    });

    return () => unsub();
  }, [router, locale]);

  const navItems = [
    { name: t("home"), href: `/${locale}/dashboard/home`, icon: <Home size={18} /> },
    // { name: t("documents"), href: `/${locale}/dashboard/documents`, icon: <FileText size={18} /> },
    { name: t("create"), href: `/${locale}/dashboard/upload`, icon: <Upload size={18} /> },
    // { name: t("community"), href: `/${locale}/dashboard/community`, icon: <Users size={18} /> },
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
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  // 🌀 Loading enquanto verifica auth
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
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#1E212A]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/dashboard/home`} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-sm" />
            <span className="font-semibold text-lg">Quibly</span>
          </Link>
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "text-sm font-medium transition flex items-center gap-1",
                pathname.includes(item.href)
                  ? "text-blue-500"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Avatar + idioma + sair */}
        <div className="flex items-center gap-3 relative">
          {/* Idioma */}
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
              src={user.photoURL || "https://i.pravatar.cc/40"}
              alt="Avatar"
              width={36}
              height={36}
              className="rounded-full border border-[#1E212A]"
            />
          )}

          {/* Sair */}
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-400 hover:text-red-500 transition"
            title={t("logout")}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 pb-24">{children}</main>

      {/* Menu mobile fixo */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B0D12]/95 border-t border-[#1E212A] flex justify-around py-3 backdrop-blur-lg">
        {navItems.map((item) => {
          const active = pathname.includes(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center text-xs transition",
                active ? "text-blue-500" : "text-gray-400 hover:text-white"
              )}
            >
              <div>{item.icon}</div>
              <span className="mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

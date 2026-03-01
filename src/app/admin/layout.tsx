"use client";

import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import clsx from "clsx";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LayoutDashboard, LogOut, Shield, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/en/login");
        return;
      }

      try {
        const { data } = await api.get("/users/me");
        if (data.role === "ADMIN") {
          setAuthorized(true);
        } else {
          router.push("/en/dashboard/home");
        }
      } catch {
        router.push("/en/login");
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0D12] text-gray-400">
        <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
        Checking access...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#0B0D12] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-[#1E212A] bg-[#0B0D12] flex flex-col fixed h-full">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-[#1E212A]">
          <Shield size={20} className="text-blue-500" />
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                  active
                    ? "bg-blue-600/15 text-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-[#1E212A]"
                )}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#1E212A]">
          <button
            onClick={async () => {
              await signOut(auth);
              router.push("/en/login");
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-500 hover:bg-[#1E212A] transition w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 p-8">{children}</main>
    </div>
  );
}

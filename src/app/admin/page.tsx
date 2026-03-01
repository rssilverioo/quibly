"use client";

import { api } from "@/lib/api";
import {
  Users,
  Crown,
  UserCheck,
  Activity,
  Layers,
  HelpCircle,
  FileText,
  DollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";

type Stats = {
  users: {
    total: number;
    pro: number;
    free: number;
    activeToday: number;
    activeThisWeek: number;
  };
  content: {
    flashcardSets: number;
    quizzes: number;
    documents: number;
  };
  generationsToday: {
    flashcards: number;
    quizzes: number;
  };
  topUsersByXP: {
    id: string;
    name: string | null;
    email: string | null;
    photoUrl: string | null;
    xp: number;
    level: string;
    streak: number;
    plan: string;
  }[];
  recentSignups: {
    id: string;
    name: string | null;
    email: string | null;
    photoUrl: string | null;
    plan: string;
    createdAt: string;
  }[];
  estimatedMRR: number;
};

const statCards = [
  { key: "total", label: "Total Users", icon: Users, color: "text-blue-400", getValue: (s: Stats) => s.users.total },
  { key: "pro", label: "PRO Users", icon: Crown, color: "text-yellow-400", getValue: (s: Stats) => s.users.pro },
  { key: "free", label: "Free Users", icon: UserCheck, color: "text-gray-400", getValue: (s: Stats) => s.users.free },
  { key: "active", label: "Active Today", icon: Activity, color: "text-green-400", getValue: (s: Stats) => s.users.activeToday },
  { key: "flashcards", label: "Flashcard Sets", icon: Layers, color: "text-purple-400", getValue: (s: Stats) => s.content.flashcardSets },
  { key: "quizzes", label: "Quizzes", icon: HelpCircle, color: "text-cyan-400", getValue: (s: Stats) => s.content.quizzes },
  { key: "documents", label: "Documents", icon: FileText, color: "text-orange-400", getValue: (s: Stats) => s.content.documents },
  { key: "mrr", label: "Estimated MRR", icon: DollarSign, color: "text-emerald-400", getValue: (s: Stats) => `R$${s.estimatedMRR.toFixed(2)}` },
];

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[#11141A] border border-[#1E212A] rounded-xl p-5 animate-pulse h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-gray-400">
        <h1 className="text-2xl font-bold text-white mb-4">Overview</h1>
        <p>Failed to load stats.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-[#11141A] border border-[#1E212A] rounded-xl p-5 flex items-center gap-4"
          >
            <div className={`p-2.5 rounded-lg bg-[#1E212A] ${card.color}`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{card.label}</p>
              <p className="text-xl font-bold">{card.getValue(stats)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generations Today */}
        <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Generations Today</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0B0D12] rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">{stats.generationsToday.flashcards}</p>
              <p className="text-xs text-gray-400 mt-1">Flashcard Sets</p>
            </div>
            <div className="bg-[#0B0D12] rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-cyan-400">{stats.generationsToday.quizzes}</p>
              <p className="text-xs text-gray-400 mt-1">Quizzes</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Active this week: <span className="text-white font-medium">{stats.users.activeThisWeek}</span> users
          </div>
        </div>

        {/* Top Users by XP */}
        <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Top Users by XP</h2>
          <div className="space-y-2">
            {stats.topUsersByXP.map((user, i) => (
              <div
                key={user.id}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#1E212A] transition"
              >
                <span className="text-xs text-gray-500 w-5 text-right font-mono">
                  {i + 1}
                </span>
                <div className="w-7 h-7 rounded-full bg-[#1E212A] flex items-center justify-center text-xs font-bold text-gray-300 shrink-0 overflow-hidden">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    (user.name?.[0] || "?").toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{user.name || user.email || "Unknown"}</p>
                </div>
                <span className="text-xs text-gray-400">{user.level}</span>
                {user.plan === "PRO" && (
                  <Crown size={14} className="text-yellow-400 shrink-0" />
                )}
                <span className="text-sm font-semibold text-blue-400">{user.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Signups */}
      <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#1E212A]">
                <th className="text-left py-2 px-3 font-medium">User</th>
                <th className="text-left py-2 px-3 font-medium">Plan</th>
                <th className="text-left py-2 px-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSignups.map((user) => (
                <tr key={user.id} className="border-b border-[#1E212A]/50 hover:bg-[#1E212A]/30">
                  <td className="py-2.5 px-3">
                    <div>
                      <p className="font-medium">{user.name || "Unnamed"}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.plan === "PRO"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-gray-500/10 text-gray-400"
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

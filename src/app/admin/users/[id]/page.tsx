"use client";

import { api } from "@/lib/api";
import clsx from "clsx";
import {
  ArrowLeft,
  Crown,
  FileText,
  Flame,
  HelpCircle,
  Layers,
  Mail,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type UserDetail = {
  id: string;
  firebaseUid: string;
  name: string | null;
  email: string | null;
  photoUrl: string | null;
  language: string;
  plan: string;
  role: string;
  xp: number;
  streak: number;
  level: string;
  lastStudyDate: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
  documents: { id: string; title: string; subject: string | null; createdAt: string }[];
  flashcardSets: { id: string; topic: string; createdAt: string; _count: { cards: number } }[];
  quizzes: { id: string; topic: string | null; createdAt: string; _count: { questions: number } }[];
  dailyUsages: { date: string; flashcardsGenerated: number; quizzesGenerated: number }[];
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${userId}`)
      .then(({ data }) => setUser(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 bg-[#1E212A] rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Link href="/admin/users" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
          <ArrowLeft size={16} /> Back to Users
        </Link>
        <p className="text-gray-400">User not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
        <ArrowLeft size={16} /> Back to Users
      </Link>

      {/* Profile Header */}
      <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#1E212A] flex items-center justify-center text-xl font-bold text-gray-300 shrink-0 overflow-hidden">
          {user.photoUrl ? (
            <img src={user.photoUrl} alt="" className="w-full h-full object-cover rounded-full" />
          ) : (
            (user.name?.[0] || "?").toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{user.name || "Unnamed"}</h1>
            {user.plan === "PRO" && <Crown size={16} className="text-yellow-400" />}
            {user.role === "ADMIN" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">ADMIN</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
            <Mail size={14} />
            {user.email || "No email"}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
            <span>ID: {user.id}</span>
            <span>Language: {user.language}</span>
            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Zap size={18} />} label="XP" value={user.xp} color="text-blue-400" />
        <StatCard icon={<Flame size={18} />} label="Streak" value={`${user.streak} days`} color="text-orange-400" />
        <StatCard icon={<Trophy size={18} />} label="Level" value={user.level} color="text-purple-400" />
        <StatCard icon={<Star size={18} />} label="Plan" value={user.plan} color={user.plan === "PRO" ? "text-yellow-400" : "text-gray-400"} />
      </div>

      {/* Subscription */}
      <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3">Subscription</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <InfoField label="Status" value={user.subscriptionStatus || "inactive"} />
          <InfoField label="Stripe Customer" value={user.stripeCustomerId || "N/A"} />
          <InfoField label="Subscription ID" value={user.stripeSubscriptionId || "N/A"} />
          <InfoField
            label="Period End"
            value={user.currentPeriodEnd ? new Date(user.currentPeriodEnd).toLocaleDateString() : "N/A"}
          />
        </div>
      </div>

      {/* Usage History */}
      {user.dailyUsages.length > 0 && (
        <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">Usage (Last 30 Days)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-[#1E212A] text-left">
                  <th className="py-2 px-3 font-medium">Date</th>
                  <th className="py-2 px-3 font-medium">Flashcards</th>
                  <th className="py-2 px-3 font-medium">Quizzes</th>
                </tr>
              </thead>
              <tbody>
                {user.dailyUsages.map((usage) => (
                  <tr key={usage.date} className="border-b border-[#1E212A]/50">
                    <td className="py-2 px-3 text-gray-300">{usage.date}</td>
                    <td className="py-2 px-3">
                      <span className="text-purple-400">{usage.flashcardsGenerated}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-cyan-400">{usage.quizzesGenerated}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ContentList
          title="Documents"
          icon={<FileText size={16} className="text-orange-400" />}
          items={user.documents.map((d) => ({
            id: d.id,
            label: d.title,
            sub: d.subject || "",
            date: d.createdAt,
          }))}
        />
        <ContentList
          title="Flashcard Sets"
          icon={<Layers size={16} className="text-purple-400" />}
          items={user.flashcardSets.map((f) => ({
            id: f.id,
            label: f.topic,
            sub: `${f._count.cards} cards`,
            date: f.createdAt,
          }))}
        />
        <ContentList
          title="Quizzes"
          icon={<HelpCircle size={16} className="text-cyan-400" />}
          items={user.quizzes.map((q) => ({
            id: q.id,
            label: q.topic || "Untitled Quiz",
            sub: `${q._count.questions} questions`,
            date: q.createdAt,
          }))}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-4 flex items-center gap-3">
      <div className={clsx("p-2 rounded-lg bg-[#1E212A]", color)}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-gray-300 truncate">{value}</p>
    </div>
  );
}

function ContentList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: { id: string; label: string; sub: string; date: string }[];
}) {
  return (
    <div className="bg-[#11141A] border border-[#1E212A] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs text-gray-500 ml-auto">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No {title.toLowerCase()} yet.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="py-2 px-3 rounded-lg hover:bg-[#1E212A] transition">
              <p className="text-sm truncate">{item.label}</p>
              <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                <span>{item.sub}</span>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

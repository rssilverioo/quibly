"use client";

import { api } from "@/lib/api";
import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Search,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  photoUrl: string | null;
  plan: string;
  role: string;
  xp: number;
  streak: number;
  level: string;
  createdAt: string;
  subscriptionStatus: string | null;
  _count: {
    flashcardSets: number;
    quizzes: number;
    documents: number;
  };
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        sortBy,
        sortOrder,
      });
      if (search) params.set("search", search);
      if (planFilter) params.set("plan", planFilter);

      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {
      // handled by auth guard
    }
    setLoading(false);
  }, [search, planFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-medium hover:text-white transition"
    >
      {children}
      <ArrowUpDown
        size={12}
        className={clsx(sortBy === field ? "text-blue-400" : "text-gray-600")}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#11141A] border border-[#1E212A] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="bg-[#11141A] border border-[#1E212A] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
        >
          <option value="">All Plans</option>
          <option value="FREE">Free</option>
          <option value="PRO">PRO</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#11141A] border border-[#1E212A] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#1E212A] text-left">
                <th className="py-3 px-4">
                  <SortButton field="name">User</SortButton>
                </th>
                <th className="py-3 px-4">
                  <SortButton field="plan">Plan</SortButton>
                </th>
                <th className="py-3 px-4">
                  <SortButton field="xp">XP</SortButton>
                </th>
                <th className="py-3 px-4">Content</th>
                <th className="py-3 px-4">
                  <SortButton field="createdAt">Joined</SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#1E212A]/50">
                    <td colSpan={5} className="py-4 px-4">
                      <div className="h-4 bg-[#1E212A] rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#1E212A]/50 hover:bg-[#1E212A]/30 transition"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="flex items-center gap-3 hover:text-blue-400 transition"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#1E212A] flex items-center justify-center text-xs font-bold text-gray-300 shrink-0 overflow-hidden">
                          {user.photoUrl ? (
                            <img src={user.photoUrl} alt="" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            (user.name?.[0] || "?").toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name || "Unnamed"}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={clsx(
                          "text-xs px-2 py-0.5 rounded-full",
                          user.plan === "PRO"
                            ? "bg-yellow-400/10 text-yellow-400"
                            : "bg-gray-500/10 text-gray-400"
                        )}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-400">{user.xp}</span>
                        <span className="text-xs text-gray-500">{user.level}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-3 text-xs text-gray-400">
                        <span>{user._count.flashcardSets} sets</span>
                        <span>{user._count.quizzes} quizzes</span>
                        <span>{user._count.documents} docs</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E212A]">
            <p className="text-xs text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E212A] transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchUsers(pageNum)}
                    className={clsx(
                      "w-8 h-8 rounded-lg text-xs transition",
                      pagination.page === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-[#1E212A]"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E212A] transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

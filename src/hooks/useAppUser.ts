"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export type AppUser = {
  id: string;
  firebaseUid: string;
  email: string | null;
  name: string | null;
  plan: "FREE" | "PREMIUM";
  createdAt: string;
  updatedAt: string;
};

export function useAppUser() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) {
      setAppUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get("/me");
        setAppUser(data);
      } catch (err) {
        console.error("❌ Erro ao carregar usuário da API", err);
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [firebaseUser, authLoading]);

  return { appUser, firebaseUser, loading };
}

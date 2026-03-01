"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export type AppUser = {
  id: string;
  firebaseUid: string;
  email: string | null;
  name: string | null;
  photoUrl: string | null;
  plan: "FREE" | "PRO";
  xp: number;
  streak: number;
  level: string;
  lastStudyDate: string | null;
  subscriptionStatus: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export function useAppUser() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/users/me");
      setAppUser(data);
    } catch (err) {
      console.error("Error loading user from API", err);
      setAppUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) {
      setAppUser(null);
      setLoading(false);
      return;
    }

    fetchUser();
  }, [firebaseUser, authLoading]);

  return { appUser, firebaseUser, loading, refetch: fetchUser };
}

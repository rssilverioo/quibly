"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { CreditCard, Crown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl"; // ✅ import do locale
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Subscription = {
  status: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  current_period_end?: string | null;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  plan: "FREE" | "PREMIUM";
  language?: "PT" | "EN";
  Subscription?: Subscription | null;
};

export default function SubscribePage() {
  const t = useTranslations("Subscribe");
  const locale = useLocale(); // ✅ pega locale atual (pt / en)
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<"BRL" | "USD">("USD");
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [processing, setProcessing] = useState(false);

  // ✅ Detect locale preferido do usuário (fallback pro idioma do app)
  const userLocale =
    user?.language === "PT"
      ? "pt"
      : user?.language === "EN"
      ? "en"
      : locale || "en";

  // 🔹 Detect currency
  useEffect(() => {
    async function detectCurrency() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setCurrency(data.country_code === "BR" ? "BRL" : "USD");
      } catch {
        setCurrency("USD");
      }
    }
    detectCurrency();
  }, []);

  // 🔹 Fetch user from backend
  useEffect(() => {
    if (authLoading || !firebaseUser) return;
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => toast.error(t("errors.loadUser")));
  }, [firebaseUser, authLoading, t]);

  // 🔹 Criar checkout
  const handleSubscribe = async () => {
    if (!user) return toast.error(t("errors.noUser"));
    setProcessing(true);
    try {
      const { data } = await api.post("/stripe/checkout", {
        userId: user.id,
        currency,
        interval,
      });
      if (data.url) window.location.href = data.url;
      else toast.error(t("errors.startCheckout"));
    } catch {
      toast.error(t("errors.connectStripe"));
    } finally {
      setProcessing(false);
    }
  };

  // 🔹 Gerenciar / Cancelar assinatura
  const handleManage = () => {
    if (!user) return toast.error(t("errors.noUser"));

    // ✅ Redireciona direto para a página de cancelamento
    window.location.href = `/${userLocale}/dashboard/subscribe/cancel`;
  };

  const isLoading = authLoading || !user;

  // 🔹 Skeleton de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F1117] p-4">
        <Card className="max-w-lg w-full bg-[#1C1F27] border border-[#262B35] shadow-2xl p-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
            <Skeleton className="h-6 w-48 mx-auto rounded-md" />
          </CardHeader>

          <CardContent className="space-y-3 mt-6">
            <Skeleton className="h-4 w-3/4 mx-auto rounded" />
            <Skeleton className="h-4 w-2/3 mx-auto rounded" />

            <div className="flex justify-center gap-2 mt-4">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>

            <Skeleton className="h-6 w-32 mx-auto mt-4 rounded-md" />
            <div className="space-y-2 mt-6">
              <Skeleton className="h-4 w-5/6 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </CardContent>

          <CardFooter className="mt-6">
            <Skeleton className="h-10 w-full rounded-md" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  const isPremium =
    user.plan === "PREMIUM" || user.Subscription?.status === "active";

  const getPrice = () => {
    if (currency === "BRL") {
      return interval === "yearly" ? "R$199,99 / ano" : "R$29,99 / mês";
    }
    return interval === "yearly" ? "$69.99 / year" : "$9.99 / month";
  };

  const nextBilling = user.Subscription?.current_period_end
    ? new Date(user.Subscription.current_period_end).toLocaleDateString()
    : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F1117] text-white p-4">
      <Card className="max-w-lg w-full bg-[#1C1F27] border border-[#262B35] shadow-2xl">
        <CardHeader className="text-center">
          <Crown className="w-10 h-10 mx-auto text-[#6C63FF]" />
          <CardTitle className="text-2xl text-white font-bold mt-2">
            {isPremium ? t("titlePremium") : t("titleFree")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          {!isPremium ? (
            <>
              <p className="text-gray-400">{t("description")}</p>

              <div className="flex justify-center gap-2 mt-2">
                <Button
                  variant={interval === "monthly" ? "default" : "outline"}
                  onClick={() => setInterval("monthly")}
                >
                  {t("monthly")}
                </Button>
                <Button
                  variant={interval === "yearly" ? "default" : "outline"}
                  onClick={() => setInterval("yearly")}
                >
                  {t("yearly")}
                </Button>
              </div>

              <p className="text-xl font-semibold text-[#6C63FF] mt-3">
                {getPrice()}
              </p>

              <ul className="text-left text-gray-300 list-disc list-inside mt-4">
                <li>✨ {t("features.unlimitedQuizzes")}</li>
                <li>📚 {t("features.unlimitedFlashcards")}</li>
                <li>🚀 {t("features.earlyAccess")}</li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-green-400">{t("activePlan")}</p>
              {nextBilling && (
                <p className="text-gray-400 text-sm">
                  {t("nextBilling")}{" "}
                  <span className="text-white">{nextBilling}</span>
                </p>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {!isPremium ? (
            <Button
              disabled={processing}
              onClick={handleSubscribe}
              className="bg-[#6C63FF] hover:bg-[#5750E5] text-white w-full"
            >
              {processing
                ? t("redirecting")
                : `${t("subscribeBtn")} ${getPrice()}`}
            </Button>
          ) : (
            <Button
              onClick={handleManage}
              disabled={processing}
              className="bg-[#2E3340] hover:bg-[#3A3F4F] text-white w-full"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {t("manageBtn")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

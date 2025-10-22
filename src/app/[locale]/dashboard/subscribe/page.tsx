"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type Subscription = {
  status: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  plan: "FREE" | "PREMIUM";
  Subscription?: Subscription | null;
};

export default function SubscribePage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<"BRL" | "USD">("USD");
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [processing, setProcessing] = useState(false);

  // 🔹 Detecta localização
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

  // 🔹 Busca usuário autenticado do Prisma (via token Firebase)
  useEffect(() => {
    if (authLoading || !firebaseUser) return;

    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => toast.error("Erro ao carregar informações do usuário"));
  }, [firebaseUser, authLoading]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Usuário não encontrado.");
      return;
    }

    setProcessing(true);
    try {
      const { data } = await api.post("/stripe/checkout", {
        userId: user.id,
        currency,
        interval,
        
      });

      if (data.url) window.location.href = data.url;
      else toast.error("Erro ao iniciar checkout.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com o Stripe.");
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Carregando dados da assinatura...
      </div>
    );
  }

  const getPrice = () => {
    if (currency === "BRL") {
      return interval === "yearly" ? "R$199,99 / ano" : "R$29,99 / mês";
    }
    return interval === "yearly" ? "$69.99 / year" : "$9.99 / month";
  };

  const isPremium = user.plan === "PREMIUM" || user.Subscription?.status === "active";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F1117] text-white p-4">
      <Card className="max-w-md w-full bg-[#1C1F27] border border-[#262B35]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isPremium ? "🎉 Você já é Premium!" : "Assine o Quibly PRO"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {!isPremium ? (
            <>
              <p className="text-gray-400">
                Desbloqueie geração ilimitada de quizzes e flashcards.
              </p>

              <div className="flex justify-center gap-2 mt-2">
                <Button
                  variant={interval === "monthly" ? "default" : "outline"}
                  onClick={() => setInterval("monthly")}
                >
                  Mensal
                </Button>
                <Button
                  variant={interval === "yearly" ? "default" : "outline"}
                  onClick={() => setInterval("yearly")}
                >
                  Anual
                </Button>
              </div>

              <p className="text-xl font-semibold text-[#6C63FF] mt-3">{getPrice()}</p>

              <ul className="text-left text-gray-300 list-disc list-inside mt-4">
                <li>✨ Quizzes ilimitados</li>
                <li>📚 Flashcards sem limite por documento</li>
                <li>🚀 Acesso antecipado a novas features</li>
              </ul>
            </>
          ) : (
            <p className="text-green-400">
              Você tem acesso total a todos os recursos do Quibly. 🌟
            </p>
          )}
        </CardContent>

        <CardFooter>
          {!isPremium ? (
            <Button
              disabled={processing}
              onClick={handleSubscribe}
              className="bg-[#6C63FF] hover:bg-[#5750E5] text-white w-full"
            >
              {processing ? "Redirecionando..." : `Assinar ${getPrice()}`}
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled
              className="border-gray-600 text-gray-300 w-full"
            >
              Plano Premium Ativo
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

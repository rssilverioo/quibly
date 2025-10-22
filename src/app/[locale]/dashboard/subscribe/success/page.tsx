"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  plan: "FREE" | "PREMIUM";
};

export default function SubscribeSuccessPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🎉 Função para disparar confete
  const launchConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 75,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 75,
        origin: { x: 1 },
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 🔄 Busca o usuário e dispara confete se premium
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/users/me");
        setUser(data);
        if (data.plan === "PREMIUM") {
          launchConfetti();
        }
      } catch (err) {
        toast.error("Erro ao verificar assinatura.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Verificando sua assinatura...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F1117] text-white p-4">
      <Card className="max-w-md w-full bg-[#1C1F27] border border-[#262B35] text-center p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-4">
            {user?.plan === "PREMIUM"
              ? "🎉 Assinatura confirmada!"
              : "Aguardando confirmação..."}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {user?.plan === "PREMIUM" ? (
            <>
              <p className="text-gray-300 mb-4">
                Parabéns, <span className="font-semibold">{user?.name}</span>!
                <br />
                Sua assinatura do <span className="text-[#6C63FF]">Quibly PRO</span> foi ativada com sucesso.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Agora você tem acesso ilimitado a quizzes, flashcards e novos recursos exclusivos. 🚀
              </p>

              <div className="flex flex-col gap-3">
                <Link href="/dashboard">
                  <Button className="bg-[#6C63FF] hover:bg-[#5750E5] w-full">
                    Ir para o Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/subscribe">
                  <Button variant="outline" className="border-gray-600 text-gray-300 w-full">
                    Gerenciar Assinatura
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-6">
                Estamos processando sua assinatura. Isso pode levar alguns segundos.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#6C63FF] hover:bg-[#5750E5] w-full"
              >
                Recarregar
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

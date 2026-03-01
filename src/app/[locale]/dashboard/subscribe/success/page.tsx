"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useLocale } from "next-intl";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  plan: "FREE" | "PRO";
};

export default function SubscribeSuccessPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/users/me");
        setUser(data);
        if (data.plan === "PRO") {
          launchConfetti();
        }
      } catch {
        toast.error("Error verifying subscription.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Verifying subscription...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F1117] text-white p-4">
      <Card className="max-w-md w-full bg-[#1C1F27] border border-[#262B35] text-center p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-4">
            {user?.plan === "PRO"
              ? "Subscription confirmed!"
              : "Waiting for confirmation..."}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {user?.plan === "PRO" ? (
            <>
              <p className="text-gray-300 mb-4">
                Congratulations, <span className="font-semibold">{user?.name}</span>!
                <br />
                Your <span className="text-blue-500">Quibly PRO</span> subscription is now active.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                You now have access to 5 daily generations and priority processing.
              </p>

              <div className="flex flex-col gap-3">
                <Link href={`/${locale}/dashboard/home`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/pricing`}>
                  <Button variant="outline" className="border-gray-600 text-gray-300 w-full">
                    Manage Subscription
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-6">
                Processing your subscription. This may take a few seconds.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                Reload
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

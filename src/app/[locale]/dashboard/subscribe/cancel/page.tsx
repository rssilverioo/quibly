"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { AlertTriangle, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Subscription = {
  id: string;
  status: string;
  current_period_end?: string | null;
  stripeSubscriptionId?: string | null;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  plan: "FREE" | "PREMIUM";
  Subscription?: Subscription | null;
};

export default function CancelSubscriptionPage() {
  const t = useTranslations("Cancel");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  // 🔹 Busca o user (já traz Subscription junto)
  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => toast.error(t("loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  const handleCancel = async () => {
    if (!user?.Subscription) return;
    setProcessing(true);
    try {
      await api.post("/stripe/cancel", {
        subscriptionId: user.Subscription.stripeSubscriptionId,
      });
      toast.success(t("cancelSuccess"));
      router.push("/subscribe");
    } catch {
      toast.error(t("cancelError"));
    } finally {
      setProcessing(false);
      setOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F1117] p-4">
        <Card className="max-w-md w-full bg-[#1C1F27] border border-[#262B35] shadow-2xl p-6">
          <CardHeader>
            <Skeleton className="h-6 w-40 mx-auto mb-3" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user?.Subscription) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        {t("noSubscription")}
      </div>
    );
  }

  const sub = user.Subscription;
  const nextBilling = sub.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString()
    : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F1117] text-white p-4">
      <Card className="max-w-md w-full bg-[#1C1F27] border border-[#262B35] shadow-xl">
        <CardHeader className="text-center">
          <CreditCard className="w-8 h-8 mx-auto text-[#6C63FF]" />
          <CardTitle className="text-2xl font-bold mt-2">
            {t("title")}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-400">
            {t("status")}:{" "}
            <span
              className={
                sub.status === "active" ? "text-green-400" : "text-yellow-400"
              }
            >
              {sub.status}
            </span>
          </p>

          {nextBilling && (
            <p className="text-gray-400 text-sm">
              {t("nextBilling")}{" "}
              <span className="text-white">{nextBilling}</span>
            </p>
          )}

          <div className="mt-6 border-t border-[#262B35] pt-4">
            <AlertTriangle className="w-5 h-5 mx-auto text-yellow-500 mb-2" />
            <p className="text-gray-300 text-sm mb-3">{t("warning")}</p>
            <Button
              onClick={() => setOpen(true)}
              className="bg-red-600 hover:bg-red-700 w-full"
            >
              {t("cancelBtn")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Modal de confirmação */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#1C1F27] text-white border border-[#262B35]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {t("modal.title")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-300 mt-2">{t("modal.desc")}</p>

          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300"
            >
              {t("modal.keep")}
            </Button>
            <Button
              disabled={processing}
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {processing ? t("modal.canceling") : t("modal.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import { api } from "@/lib/api";
import { ArrowLeft, Check, Crown, Zap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import clsx from "clsx";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type User = {
  id: string;
  name: string | null;
  email: string | null;
  plan: "FREE" | "PRO";
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
};

type Billing = "monthly" | "yearly";

const PRICES = {
  monthly: { brl: "R$29,90", usd: "$9.99" },
  yearly: { brl: "R$199,99", usd: "$99.99" },
};

export default function PricingPage() {
  const t = useTranslations("Pricing");
  const locale = useLocale();
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const { usage } = useUsage();
  const [user, setUser] = useState<User | null>(null);
  const [processing, setProcessing] = useState(false);
  const [billing, setBilling] = useState<Billing>("monthly");
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (authLoading || !firebaseUser) return;
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => toast.error(t("errors.loadUser")));
  }, [firebaseUser, authLoading, t]);

  const fetchClientSecret = useCallback(async () => {
    if (!user) return "";
    const { data } = await api.post("/stripe/checkout", {
      userId: user.id,
      locale,
      billing,
    });
    return data.clientSecret;
  }, [user, locale, billing]);

  const handleSubscribe = () => {
    if (!user) return toast.error(t("errors.noUser"));
    setShowCheckout(true);
  };

  const handleCancel = async () => {
    if (!user?.stripeSubscriptionId) return;
    setProcessing(true);
    try {
      await api.post("/stripe/cancel", {
        subscriptionId: user.stripeSubscriptionId,
      });
      toast.success(t("cancelSuccess"));
      setUser((prev) => (prev ? { ...prev, plan: "FREE" } : null));
    } catch {
      toast.error(t("cancelError"));
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPro = user.plan === "PRO";
  const isBRL = locale === "pt";
  const proPrice = isBRL ? PRICES[billing].brl : PRICES[billing].usd;
  const freePrice = isBRL ? "R$0" : "$0";
  const period = billing === "monthly"
    ? (isBRL ? "/mês" : "/mo")
    : (isBRL ? "/ano" : "/yr");
  const savingsLabel = isBRL ? "Economize R$158,81/ano" : "Save $19.89/yr";

  // Embedded checkout view
  if (showCheckout) {
    return (
      <div className="py-8 px-4 max-w-2xl mx-auto">
        <button
          onClick={() => setShowCheckout(false)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
        >
          <ArrowLeft size={16} />
          {isBRL ? "Voltar aos planos" : "Back to plans"}
        </button>

        <div className="bg-[#11141A] border border-[#1E212A] rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown size={18} className="text-yellow-400" />
              <span className="font-semibold">Pro {billing === "yearly" ? (isBRL ? "Anual" : "Yearly") : (isBRL ? "Mensal" : "Monthly")}</span>
            </div>
            <span className="text-lg font-bold">{proPrice}<span className="text-sm text-gray-400 font-normal">{period}</span></span>
          </div>
        </div>

        <div id="checkout" className="rounded-2xl overflow-hidden">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-center mb-2">{t("title")}</h1>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-2 mt-4 mb-6">
          <button
            onClick={() => setBilling("monthly")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition",
              billing === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-[#1E212A] text-gray-400 hover:text-white"
            )}
          >
            {isBRL ? "Mensal" : "Monthly"}
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition relative",
              billing === "yearly"
                ? "bg-blue-600 text-white"
                : "bg-[#1E212A] text-gray-400 hover:text-white"
            )}
          >
            {isBRL ? "Anual" : "Yearly"}
            <span className="absolute -top-2.5 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {isBRL ? "-44%" : "-17%"}
            </span>
          </button>
        </div>

        {/* Current usage section */}
        {usage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#11141A] border border-[#1E212A] rounded-2xl p-4 mb-8 max-w-md mx-auto"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">{t("currentPlan")}: {isPro ? "Pro" : "Free"}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0B0D12] rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-blue-400">{usage.flashcards.used}/{usage.flashcards.limit}</p>
                <p className="text-xs text-gray-500">Flashcards</p>
              </div>
              <div className="bg-[#0B0D12] rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-green-400">{usage.quizzes.used}/{usage.quizzes.limit}</p>
                <p className="text-xs text-gray-500">Quizzes</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#11141A] border border-[#1E212A] rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Free</h2>
          <p className="text-3xl font-bold text-white mb-6">
            {freePrice} <span className="text-sm text-gray-400 font-normal">{isBRL ? "/mês" : "/mo"}</span>
          </p>
          <ul className="space-y-3 text-gray-300 text-sm mb-8">
            <li className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" /> {t("free.upload")}
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" /> {t("free.flashcards")}
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" /> {t("free.quizzes")}
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" /> {t("free.gamification")}
            </li>
          </ul>
          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-[#1E212A] text-gray-400 text-sm font-medium cursor-default"
          >
            {t("currentPlan")}
          </button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#11141A] border-2 border-blue-600 rounded-2xl p-6 relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              {t("recommended")}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Crown size={20} className="text-yellow-400" /> Pro
          </h2>
          <p className="text-3xl font-bold text-white mb-1">
            {proPrice} <span className="text-sm text-gray-400 font-normal">{period}</span>
          </p>
          {billing === "yearly" && (
            <p className="text-xs text-green-400 mb-5">{savingsLabel}</p>
          )}
          {billing === "monthly" && <div className="mb-6" />}
          <ul className="space-y-3 text-gray-300 text-sm mb-8">
            <li className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" /> {t("pro.uploads")}
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" /> {t("pro.flashcards")}
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" /> {t("pro.quizzes")}
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" /> {t("pro.priority")}
            </li>
          </ul>
          {isPro ? (
            <button
              onClick={handleCancel}
              disabled={processing}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-50"
            >
              {processing ? t("processing") : t("cancelPlan")}
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={processing}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50"
            >
              {processing ? t("processing") : t("upgradePro")}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

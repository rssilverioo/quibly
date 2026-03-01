"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppUser } from "@/hooks/useAppUser";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import clsx from "clsx";

type Billing = "monthly" | "yearly";

const PRICES = {
  monthly: { brl: "R$29,90", usd: "$9.99", period_brl: "/mês", period_en: "/mo" },
  yearly: { brl: "R$199,99", usd: "$99.99", period_brl: "/ano", period_en: "/yr" },
};

const PricingSection = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Landing.pricing");
  const { appUser, firebaseUser, loading: loadingUser } = useAppUser();
  const [billing, setBilling] = useState<Billing>("monthly");

  const isBRL = locale === "pt";

  const handlePlanClick = (planName: string) => {
    if (loadingUser) return;

    if (!firebaseUser) {
      router.push(`/${locale}/register`);
      return;
    }

    if (planName === "Pro") {
      if (appUser?.plan === "PRO") {
        router.push(`/${locale}/dashboard/home`);
        return;
      }
      router.push(`/${locale}/dashboard/pricing`);
      return;
    }
  };

  const price = PRICES[billing];

  const plans = [
    {
      name: "Free",
      price: isBRL ? "R$0" : "$0",
      period: isBRL ? "/mês" : "/mo",
      description: t("freeDesc"),
      features: [
        t("freeFeature1"),
        t("freeFeature2"),
        t("freeFeature3"),
        t("freeFeature4"),
      ],
      cta: t("freeCta"),
    },
    {
      name: "Pro",
      price: isBRL ? price.brl : price.usd,
      period: isBRL ? price.period_brl : price.period_en,
      description: t("proDesc"),
      features: [
        t("proFeature1"),
        t("proFeature2"),
        t("proFeature3"),
        t("proFeature4"),
      ],
      cta: t("proCta"),
      highlight: true,
      badge: "POPULAR",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-black dark:text-white mb-6">
            {t("headline")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setBilling("monthly")}
            className={clsx(
              "px-5 py-2.5 rounded-lg text-sm font-medium transition",
              billing === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-[#1E212A] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
            )}
          >
            {isBRL ? "Mensal" : "Monthly"}
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={clsx(
              "px-5 py-2.5 rounded-lg text-sm font-medium transition relative",
              billing === "yearly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-[#1E212A] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
            )}
          >
            {isBRL ? "Anual" : "Yearly"}
            <span className="absolute -top-2.5 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {isBRL ? "-44%" : "-17%"}
            </span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative border rounded-2xl p-8 transition-all duration-300 hover:shadow-lg ${
                plan.highlight
                  ? "border-blue-600 shadow-xl bg-white dark:bg-[#11141A]"
                  : "bg-white dark:bg-[#11141A] border-gray-200 dark:border-[#1E212A]"
              } text-black dark:text-white`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-2 flex items-center justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                {plan.highlight && billing === "yearly" && (
                  <p className="text-xs text-green-500 font-medium">
                    {isBRL ? "Economize R$158,81/ano" : "Save $19.89/yr"}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.highlight
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : ""
                }`}
                onClick={() => handlePlanClick(plan.name)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

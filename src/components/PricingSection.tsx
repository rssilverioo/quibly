"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppUser } from "@/hooks/useAppUser"; // ✅ Prisma + Firebase

const PricingSection = () => {
  const router = useRouter();
  const { appUser, firebaseUser, loading: loadingUser } = useAppUser();

  const [isAnnual, setIsAnnual] = useState(false);
  const [isBR, setIsBR] = useState<boolean | null>(null);

  // detect browser language
  useEffect(() => {
    if (typeof window !== "undefined") {
      const locale = navigator.language.toLowerCase();
      setIsBR(locale.startsWith("pt-br"));
    }
  }, []);

  const locale = isBR ? "pt" : "en";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(isBR ? "pt-BR" : "en-US", {
      style: "currency",
      currency: isBR ? "BRL" : "USD",
      minimumFractionDigits: 2,
    }).format(value);

  const monthlyPrice = useMemo(() => (isBR ? 29.9 : 9.99), [isBR]);
  const annualPrice = useMemo(() => (isBR ? 199.9 : 99.99), [isBR]);
  const annualOriginal = useMemo(() => (isBR ? 358.8 : 119.88), [isBR]);

  const handlePlanClick = (planName: string) => {
    if (loadingUser) return;

    // user not logged in → go to register page
    if (!firebaseUser) {
      router.push(`/${locale}/register`);
      return;
    }

    // user logged in + clicking on Pro
    if (planName === "Pro") {
      if (appUser?.plan === "PREMIUM") {
        router.push(`/${locale}/dashboard`);
        return;
      }

      router.push(`/${locale}/dashboard/subscribe`);
      return;
    }

    // Enterprise → contact
    if (planName === "Enterprise") {
      router.push(`/${locale}/contact`);
      return;
    }
  };

  const plans = [
    {
      name: "Free",
      price: formatCurrency(0),
      period: "/mo",
      description: "Start generating flashcards and mind maps — no credit card required.",
      features: [
        "Limited uploads per month",
        "Basic flashcards and summaries",
        "Mind map generation (limited)",
        "Standard support",
      ],
      cta: "Get started free",
    },
    {
      name: "Pro",
      price: isAnnual ? formatCurrency(annualPrice) : formatCurrency(monthlyPrice),
      period: isAnnual ? "/year" : "/mo",
      originalPrice: isAnnual ? formatCurrency(annualOriginal) : null,
      description:
        "Unlimited flashcards, summaries, and mind maps — learn faster with AI.",
      features: [
        "Unlimited uploads",
        "Unlimited flashcards + summaries",
        "Advanced mind maps",
        "Priority support",
      ],
      cta: "Upgrade to Pro",
      highlight: true,
      badge: "POPULAR",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For schools, institutions, and teams that need scale and control.",
      features: [
        "Team admin dashboard",
        "LMS integrations (Canvas, Moodle, etc.)",
        "Data governance & privacy",
        "White-glove onboarding",
      ],
      cta: "Contact sales",
      gradient: true,
    },
  ];

  // prevents flickering while detecting locale
  if (isBR === null) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-6">
            Start for free. <br /> Upgrade when you're ready.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Whether you're studying solo or part of a team — there's a plan made for you.
          </p>

          {/* Monthly / Annual toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-medium ${!isAnnual ? "text-black" : "text-gray-500"}`}>
              Monthly
            </span>

            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isAnnual ? "bg-black" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isAnnual ? "translate-x-[22px]" : "translate-x-1"
                }`}
              />
            </button>

            <span className={`font-medium ${isAnnual ? "text-black" : "text-gray-500"}`}>
              Annually
            </span>
          </div>
        </div>

        {/* pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative border rounded-2xl p-8 transition-all duration-300 hover:shadow-lg ${
                plan.gradient
                  ? "bg-gradient-to-br from-[#1E1E1E] to-[#000000] text-white border-transparent"
                  : "bg-white border-gray-200 text-black"
              } ${plan.highlight ? "border-black shadow-xl scale-105" : ""}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>

                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>

                  {plan.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">{plan.originalPrice}</span>
                  )}

                  <span className="text-sm">{plan.period}</span>
                </div>

                <p className="text-sm max-w-sm mx-auto">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
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

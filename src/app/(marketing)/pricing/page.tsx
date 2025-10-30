import PricingSection from "@/components/PricingSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – Quibly",
  description: "Compare our Free, Pro and Enterprise plans. Discover the perfect AI note-taking solution for individuals and teams.",
  metadataBase: new URL("https://quibly.com"),
  openGraph: {
    title: "Pricing – Quibly",
    description: "Compare plans for AI-powered meeting notes. Choose the best fit for your team or personal productivity.",
    url: "https://quibly.com/pricing",
    siteName: "Quibly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quibly pricing plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing – Quibly",
    description: "Explore our pricing plans and upgrade when you're ready.",
    images: ["/og-image.png"],
    creator: "@usequibly",
  },
};

export default function Pricing() {
  return <PricingSection />;
}

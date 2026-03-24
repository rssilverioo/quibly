import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { DataFastAnalytics } from "@/components/DataFastAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Quibly — AI-Powered Flashcards & Quizzes from Any PDF",
    template: "%s | Quibly",
  },
  description:
    "Upload any PDF or notes and Quibly's AI creates flashcards and quizzes in seconds. Earn XP, build streaks, and level up as you learn. Free to start.",
  metadataBase: new URL("https://tryquibly.com"),
  applicationName: "Quibly",
  keywords: [
    "AI flashcards",
    "AI quizzes",
    "study app",
    "PDF to flashcards",
    "spaced repetition",
    "gamified learning",
    "study tools",
    "Quibly",
  ],
  authors: [{ name: "Quibly" }],
  creator: "Quibly",
  openGraph: {
    type: "website",
    siteName: "Quibly",
    title: "Quibly — AI-Powered Flashcards & Quizzes from Any PDF",
    description:
      "Upload any PDF or notes and Quibly's AI creates flashcards and quizzes in seconds. Earn XP, build streaks, and level up as you learn.",
    url: "https://tryquibly.com",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quibly — AI Study Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quibly — AI-Powered Flashcards & Quizzes from Any PDF",
    description:
      "Upload any PDF or notes and Quibly's AI creates flashcards and quizzes in seconds. Earn XP, build streaks, and level up.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://tryquibly.com",
    languages: {
      en: "https://tryquibly.com/en",
      pt: "https://tryquibly.com/pt",
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages(); 

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Quibly",
    url: "https://tryquibly.com",
    description:
      "AI-powered study tools that turn PDFs and notes into flashcards and quizzes.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://tryquibly.com/home?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Quibly",
    url: "https://tryquibly.com",
    logo: "https://tryquibly.com/android-chrome-512x512.png",
    sameAs: [
      "https://apps.apple.com/us/app/quibly-ai-study/id6760320166",
      "https://play.google.com/store/apps/details?id=com.quibly.app",
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Quibly",
    applicationCategory: "EducationalApplication",
    operatingSystem: "iOS, Android, Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: undefined,
  };

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
        />
        <ReactQueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ReactQueryProvider>

        <DataFastAnalytics />
        <Toaster
          richColors
          closeButton
          position="top-right"
          toastOptions={{
            style: {
              background: "#11141A",
              color: "#fff",
              border: "1px solid #1E212A",
            },
          }}
        />
      </body>
    </html>
  );
}

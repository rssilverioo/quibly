import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quibly",
  description: "Your teacher",
};

export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        
      >

        
    {children}
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

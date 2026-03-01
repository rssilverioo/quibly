"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubscribePage() {
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${locale}/dashboard/pricing`);
  }, [locale, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
      Redirecting...
    </div>
  );
}

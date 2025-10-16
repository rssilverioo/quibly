"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/firebase";

export function useAnalytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    // Rastreia visualização de página
    trackEvent("page_view", {
      page_path: pathname + (search?.toString() ? `?${search.toString()}` : ""),
    });
  }, [pathname, search]);
}

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // precisa estar dentro do client para persistência entre renders
  const [client] = useState(() => new QueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

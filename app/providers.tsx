"use client";

import type { ReactNode } from "react";
import { KivoraProvider } from "@kivora/nextjs";

export function Providers({ children }: { children: ReactNode }) {
  return <KivoraProvider colorMode="system">{children}</KivoraProvider>;
}

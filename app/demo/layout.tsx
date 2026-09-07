import type { ReactNode } from "react";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { DemoShell } from "@/components/demo/demo-shell";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoDataProvider>
      <DemoShell>{children}</DemoShell>
    </DemoDataProvider>
  );
}

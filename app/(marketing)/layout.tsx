import type { ReactNode } from "react";
import { Footer } from "@/components/shell/footer";
import { Header } from "@/components/shell/header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

import type { ReactNode } from "react";
import { ArrowLeft, Gauge, LayoutList, PlaySquare, Users } from "lucide-react";
import Link from "next/link";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { DemoNavLink } from "@/components/demo/demo-nav-link";
import { LocaleToggle } from "@/components/shell/locale-toggle";
import { ThemeToggle } from "@/components/shell/theme-toggle";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoDataProvider>
      <div className="flex flex-1">
        <aside className="flex w-60 flex-col gap-1 bg-zinc-950 p-4 text-zinc-50">
          <div className="mb-4 px-3 text-lg font-bold">Nébula</div>
          <DemoNavLink href="/demo">
            <Gauge aria-hidden className="h-4 w-4" />
            Dashboard
          </DemoNavLink>
          <DemoNavLink href="/demo/catalogo">
            <LayoutList aria-hidden className="h-4 w-4" />
            Catálogo
          </DemoNavLink>
          <DemoNavLink href="/demo/suscriptores">
            <Users aria-hidden className="h-4 w-4" />
            Suscriptores
          </DemoNavLink>
          <DemoNavLink href="/demo/reproductor">
            <PlaySquare aria-hidden className="h-4 w-4" />
            Reproductor
          </DemoNavLink>
          <Link
            href="/"
            className="mt-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            kivora.dev
          </Link>
        </aside>
        <div className="flex flex-1 flex-col bg-background text-foreground">
          <div className="flex justify-end gap-3 border-b border-border px-6 py-3">
            <LocaleToggle />
            <ThemeToggle />
          </div>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </DemoDataProvider>
  );
}

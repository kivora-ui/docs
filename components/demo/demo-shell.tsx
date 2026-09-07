"use client";

import * as React from "react";
import { ArrowLeft, Gauge, LayoutList, Menu, PlaySquare, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@kivora/theme";
import { DemoNavLink } from "@/components/demo/demo-nav-link";
import { ThemeToggle } from "@/components/shell/theme-toggle";

// Cromado del demo. Vive en un componente cliente (y no en app/demo/layout.tsx
// directamente) porque el cajón lateral necesita estado local; el layout sigue
// siendo un componente de servidor.
export function DemoShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const closeSidebar = React.useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div className="flex flex-1">
      {/* Por debajo de sm el cajón se superpone al contenido; el fondo cierra. */}
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Cerrar el menú"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
        />
      ) : null}
      <aside
        id="demo-sidebar"
        className={cn(
          "w-60 flex-col gap-1 bg-zinc-950 p-4 text-zinc-50 sm:static sm:flex",
          isSidebarOpen ? "fixed inset-y-0 left-0 z-50 flex" : "hidden"
        )}
      >
        <div className="mb-4 px-3 text-lg font-bold">Nébula</div>
        <nav aria-label="Nébula" className="flex flex-col gap-1">
          <DemoNavLink href="/demo" onClick={closeSidebar}>
            <Gauge aria-hidden className="h-4 w-4" />
            Dashboard
          </DemoNavLink>
          <DemoNavLink href="/demo/catalogo" onClick={closeSidebar}>
            <LayoutList aria-hidden className="h-4 w-4" />
            Catálogo
          </DemoNavLink>
          <DemoNavLink href="/demo/suscriptores" onClick={closeSidebar}>
            <Users aria-hidden className="h-4 w-4" />
            Suscriptores
          </DemoNavLink>
          <DemoNavLink href="/demo/reproductor" onClick={closeSidebar}>
            <PlaySquare aria-hidden className="h-4 w-4" />
            Reproductor
          </DemoNavLink>
        </nav>
        <Link
          href="/"
          className="mt-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          kivora.dev
        </Link>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col bg-background text-foreground">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
          <button
            type="button"
            aria-label="Abrir el menú"
            aria-controls="demo-sidebar"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-accent sm:hidden"
          >
            <Menu aria-hidden className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

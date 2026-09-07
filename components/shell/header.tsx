"use client";

import Link from "next/link";
import { usePreferences } from "@/app/providers";
import { LocaleToggle } from "./locale-toggle";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { dictionary } = usePreferences();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/" className="text-lg font-bold text-foreground">
          Kivora
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink href="/">{dictionary.nav.home}</NavLink>
          <NavLink href="/docs">{dictionary.nav.docs}</NavLink>
          <NavLink href="/componentes">{dictionary.nav.components}</NavLink>
          <NavLink href="/demo">{dictionary.nav.demo}</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

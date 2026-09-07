"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@kivora/theme";

export interface DemoNavLinkProps {
  href: string;
  children: React.ReactNode;
  /** Se invoca al pulsar el enlace, para que el shell pueda cerrar el cajón. */
  onClick?: () => void;
}

export function DemoNavLink({ href, children, onClick }: DemoNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-50",
        isActive && "bg-white/10 text-zinc-50"
      )}
    >
      {children}
    </Link>
  );
}

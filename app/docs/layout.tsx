import type { Metadata } from "next";
import { DocsShell } from "./_components/docs-shell";
export const metadata: Metadata = {
  title: { default: "Documentación · Kivora", template: "%s · Kivora" },
  description:
    "Aprende a usar Kivora. Guías, ejemplos editables y API de componentes para Next.js.",
};
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsShell>{children}</DocsShell>;
}

"use client";

import { usePreferences } from "@/providers/app-providers";

export interface PlaceholderPageProps {
  titleKey: "docsTitle" | "componentsTitle" | "demoTitle";
}

export function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-foreground">{dictionary.placeholder[titleKey]}</h1>
      <p className="text-muted-foreground">{dictionary.placeholder.comingSoon}</p>
    </section>
  );
}

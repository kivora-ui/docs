"use client";

import { Button, Card, CardContent } from "@kivora/nextjs";
import Link from "next/link";
import { usePreferences } from "@/providers/app-providers";

export function Hero() {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        {dictionary.hero.eyebrow}
      </p>
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {dictionary.hero.title}
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">{dictionary.hero.subtitle}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/componentes">{dictionary.hero.ctaPrimary}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/docs">{dictionary.hero.ctaSecondary}</Link>
        </Button>
      </div>
      <Card className="mt-6 w-full max-w-sm text-left">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{dictionary.hero.previewLabel}</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{dictionary.hero.previewTitle}</p>
          <Button className="mt-4" size="sm">
            {dictionary.hero.previewButton}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

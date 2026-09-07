"use client";

import { usePreferences } from "@/app/providers";

export function FeatureGrid() {
  const { dictionary } = usePreferences();

  const features = [
    dictionary.features.forms,
    dictionary.features.tables,
    dictionary.features.player,
    dictionary.features.uploads,
    dictionary.features.theming,
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-bold text-foreground">{dictionary.features.heading}</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

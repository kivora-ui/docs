"use client";

import { usePreferences } from "@/app/providers";

export function StatsBar() {
  const { dictionary } = usePreferences();

  const stats = [
    { value: "116", label: dictionary.stats.componentFamiliesLabel },
    { value: "2", label: dictionary.stats.platformsLabel },
    { value: "2", label: dictionary.stats.themesLabel },
  ];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 py-10 text-center sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { Blocks, MonitorSmartphone, SunMoon } from "lucide-react";
import { usePreferences } from "@/app/providers";

export function StatsBar() {
  const { dictionary } = usePreferences();

  const stats = [
    { icon: Blocks, value: "116", label: dictionary.stats.componentFamiliesLabel },
    { icon: MonitorSmartphone, value: "2", label: dictionary.stats.platformsLabel },
    { icon: SunMoon, value: "2", label: dictionary.stats.themesLabel },
  ];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 py-10 text-center sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <stat.icon aria-hidden className="h-5 w-5 text-primary" />
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

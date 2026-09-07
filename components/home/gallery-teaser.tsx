"use client";

import { usePreferences } from "@/app/providers";

const COMPONENT_NAMES = [
  "Button",
  "Card",
  "Table",
  "Calendar",
  "DatePicker",
  "Carousel",
  "Player",
  "FileUpload",
  "Dialog",
  "Accordion",
] as const;

export function GalleryTeaser() {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-bold text-foreground">{dictionary.gallery.heading}</h2>
      <p className="mt-2 text-muted-foreground">{dictionary.gallery.description}</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {COMPONENT_NAMES.map((name) => (
          <a
            key={name}
            href="/componentes"
            className="rounded-lg border border-border p-4 text-center text-sm font-medium text-foreground transition-colors hover:border-primary"
          >
            {name}
          </a>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a href="/componentes" className="text-sm font-semibold text-primary hover:underline">
          {dictionary.gallery.ctaLabel}
        </a>
      </div>
    </section>
  );
}

"use client";

import {
  Calendar,
  CalendarClock,
  CirclePlay,
  CloudUpload,
  CreditCard,
  GalleryHorizontal,
  ListCollapse,
  MessageSquare,
  MousePointerClick,
  Table2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePreferences } from "@/providers/app-providers";

const COMPONENTS: { name: string; icon: LucideIcon }[] = [
  { name: "Button", icon: MousePointerClick },
  { name: "Card", icon: CreditCard },
  { name: "Table", icon: Table2 },
  { name: "Calendar", icon: Calendar },
  { name: "DatePicker", icon: CalendarClock },
  { name: "Carousel", icon: GalleryHorizontal },
  { name: "Player", icon: CirclePlay },
  { name: "FileUpload", icon: CloudUpload },
  { name: "Dialog", icon: MessageSquare },
  { name: "Accordion", icon: ListCollapse },
];

export function GalleryTeaser() {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-bold text-foreground">{dictionary.gallery.heading}</h2>
      <p className="mt-2 text-muted-foreground">{dictionary.gallery.description}</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {COMPONENTS.map(({ name, icon: Icon }) => (
          <Link
            key={name}
            href="/componentes"
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center text-sm font-medium text-foreground transition-colors hover:border-primary"
          >
            <Icon aria-hidden className="h-5 w-5 text-primary" />
            {name}
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/componentes" className="text-sm font-semibold text-primary hover:underline">
          {dictionary.gallery.ctaLabel}
        </Link>
      </div>
    </section>
  );
}

import { translator } from "./i18n";
import type { Metadata } from "next";

// Set SITE_URL to the canonical production origin before building.
const origin = new URL(process.env.SITE_URL || "https://www.kivora.pro");
if (!["http:", "https:"].includes(origin.protocol))
  throw new Error("SITE_URL must use HTTP or HTTPS");
export const siteUrl = origin.origin;
export const absoluteUrl = (path: string) => new URL(path, `${siteUrl}/`).href;
export const siteDescription =
  "Componentes para React y React Native con un mismo diseño. Crea tu web y tu app más rápido y mantén la identidad de tu marca en cada pantalla.";
export const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Kivora. Tu web y tu app. Mismo diseño.",
};

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  locale: "es" | "en" = "en",
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      siteName: "Kivora",
      title: `${title} · Kivora`,
      description,
      url: path,
      images: [{ ...socialImage, alt: translator(locale)(socialImage.alt) }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Kivora`,
      description,
      images: [{ ...socialImage, alt: translator(locale)(socialImage.alt) }],
    },
  };
}

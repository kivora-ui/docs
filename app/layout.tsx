import { getLocale } from "./_lib/i18n/server";
import { LocaleProvider } from "./_lib/i18n/provider";
import { translator } from "./_lib/i18n";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { siteUrl, siteDescription, socialImage } from "./_lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = translator(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `Kivora · ${t("Componentes para React y React Native")}`,
      template: "%s · Kivora",
    },
    description: t(siteDescription),
    openGraph: {
      type: "website",
      siteName: "Kivora",
      locale: locale === "es" ? "es_ES" : "en_US",
      images: [{ ...socialImage, alt: t(socialImage.alt) }],
    },
    twitter: {
      card: "summary_large_image",
      images: [{ ...socialImage, alt: t(socialImage.alt) }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <head>
        <link rel="describedby" href="/llms.txt" type="text/markdown" />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}

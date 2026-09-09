import { absoluteUrl, pageMetadata, siteDescription } from "../_lib/seo";
import { StructuredData } from "../_lib/structured-data";
import { getLocale } from "../_lib/i18n/server";
import { translator } from "../_lib/i18n";
export async function generateMetadata() {
  const locale = await getLocale();
  const t = translator(locale);
  return pageMetadata(
    t("Componentes para React y React Native"),
    t(siteDescription),
    "/",
    locale,
  );
}
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Kivora",
          url: absoluteUrl("/"),
          description: translator(locale)(siteDescription),
          inLanguage: locale,
        }}
      />
      {children}
    </>
  );
}

import { absoluteUrl, pageMetadata, siteDescription } from "../_lib/seo";
import { StructuredData } from "../_lib/structured-data";

export const metadata = pageMetadata("Componentes para React y React Native", siteDescription, "/");

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Kivora", url: absoluteUrl("/"), description: siteDescription, inLanguage: "es" }} />
    {children}
  </>;
}

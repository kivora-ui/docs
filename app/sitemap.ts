import type { MetadataRoute } from "next";
import { components, guides, componentHref } from "./docs/catalog";
import { absoluteUrl } from "./_lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/docs", "/docs/componentes", ...guides.map(g => `/docs/${g.slug}`), ...components.map(componentHref)].map(path => ({ url: absoluteUrl(path) }));
}

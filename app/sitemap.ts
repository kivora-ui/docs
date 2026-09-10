import { showcaseCases } from "./(public)/showcase/catalog";
import type { MetadataRoute } from "next";
import { components, guides, componentHref } from "./docs/catalog";
import { absoluteUrl } from "./_lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/showcase", ...showcaseCases.map(item => `/showcase/${item.slug}`), "/docs", "/docs/componentes", ...guides.map(g => `/docs/${g.slug}`), ...components.map(componentHref)].map(path => ({ url: absoluteUrl(path) }));
}

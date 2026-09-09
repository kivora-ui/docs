import type { MetadataRoute } from "next";
import { absoluteUrl } from "./_lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Public documentation is available to search engines and AI crawlers.
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

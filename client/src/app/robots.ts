import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/shared/lib/site-config";
export default function robots(): MetadataRoute.Robots {
  // Utility pages must remain crawlable so their noindex can be read. This is not access control.
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/__clerk/"] }, ...(site.indexable ? { sitemap: absoluteUrl("/sitemap.xml") } : {}) };
}


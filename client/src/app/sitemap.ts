import type { MetadataRoute } from "next";
import { DOC_PAGES, docHref } from "@/features/docs/data/docs-data";
import { absoluteUrl, site } from "@/shared/lib/site-config";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable) return [];
  // Date of this substantive content revision, not a fabricated per-request timestamp.
  return ["/", "/lead-management", "/compare/formspree", ...DOC_PAGES.map(page => docHref(page.id))].map(path => ({ url: absoluteUrl(path)!, lastModified: "2026-11-08" }));
}


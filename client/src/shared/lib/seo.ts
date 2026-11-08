import type { Metadata } from "next";
import { absoluteUrl, site, SITE_NAME } from "./site-config";
export function pageMetadata(title: string, description: string, pathname: string): Metadata {
  const url = absoluteUrl(pathname);
  const image = absoluteUrl("/social-preview");
  return {
    title: { absolute: title + " | " + SITE_NAME }, description,
    alternates: url ? { canonical: url } : undefined,
    robots: { index: site.indexable, follow: true },
    openGraph: { type: "website", locale: "en_US", siteName: SITE_NAME, title, description, ...(url ? { url } : {}), ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: "Infraly: website forms and lead management" }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, () => String.fromCharCode(92) + "u003c");
}


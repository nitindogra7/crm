import { absoluteUrl, site, SITE_DESCRIPTION, SITE_NAME } from "@/shared/lib/site-config";
import { jsonLd } from "@/shared/lib/seo";
export function SiteStructuredData() {
  if (!site.origin) return null;
  const home = absoluteUrl("/")!;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": home + "#organization", name: SITE_NAME, url: home, logo: absoluteUrl("/logo.svg") },
    { "@type": "WebSite", "@id": home + "#website", name: SITE_NAME, description: SITE_DESCRIPTION, url: home, publisher: { "@id": home + "#organization" } },
  ] }) }} />;
}
export function BreadcrumbData({ items }: { items: { name: string; path: string }[] }) {
  if (!site.origin) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })) }) }} />;
}


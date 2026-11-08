/** The owner confirmed infraly.online; live HTTPS redirects resolve to www on 2026-11-08. Never infer it from request headers. */
export const SITE_NAME = "Infraly";
export const SITE_DESCRIPTION = "Connect your website forms, capture enquiries, and manage leads in one place.";
export function getSiteConfig(env: Record<string, string | undefined> = process.env) {
  const configured = env.NEXT_PUBLIC_APP_URL || "https://www.infraly.online";
  let origin: string | undefined;
  try {
    const url = new URL(configured);
    const host = url.hostname.toLowerCase();
    const reserved = /(^|\.)(localhost|local|test|invalid|example|example\.com|example\.org|example\.net)$/.test(host);
    const ip = /^[\d.]+$/.test(host) || host.includes(":");
    if (url.protocol === "https:" && !url.username && !url.password && !url.port && url.pathname === "/" && !url.search && !url.hash && host.includes(".") && !reserved && !ip) origin = url.origin;
  } catch { /* Invalid origins fail closed: no sitemap URLs or canonical fallback. */ }
  const isProduction = env.NODE_ENV === "production";
  const preview = Boolean(env.VERCEL_ENV && env.VERCEL_ENV !== "production");
  const indexable = Boolean(origin && isProduction && !preview && env.SEO_INDEXING_ENABLED !== "false" && (env.VERCEL_ENV === "production" || env.SEO_INDEXING_ENABLED === "true"));
  return { origin, indexable };
}
export const site = getSiteConfig();
export function absoluteUrl(pathname: string): string | undefined {
  if (!site.origin) return undefined;
  if (!pathname.startsWith("/") || pathname.startsWith("//")) throw new Error("Expected a local absolute path");
  const url = new URL(pathname, site.origin);
  url.search = "";
  url.hash = "";
  return url.pathname === "/" ? url.origin : url.href;
}


/** Do not redirect a host to itself if the deployment overrides the canonical origin. */
export function canonicalRedirects(config = site) {
  if (!config.indexable || !config.origin) return [];
  const hostname = new URL(config.origin).hostname;
  return [
    ...(hostname === "www.infraly.online" ? [{ source: "/:path*", has: [{ type: "host" as const, value: "infraly.online" }], destination: config.origin + "/:path*", permanent: true }] : []),
    { source: "/:path*", has: [{ type: "host" as const, value: hostname }, { type: "header" as const, key: "x-forwarded-proto", value: "http" }], destination: config.origin + "/:path*", permanent: true },
  ];
}

/** Reuse the existing GA4 tag. Only fixed event names: no lead details, URLs, identifiers, or secrets. */
type ConversionEvent = "onboarding_completed" | "form_created";
export function trackConversion(event: ConversionEvent) {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production") return;
  const analytics = window as Window & { gtag?: (...args: unknown[]) => void };
  try { analytics.gtag?.("event", event); } catch { /* Analytics must never interrupt product actions. */ }
}


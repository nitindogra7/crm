# Infraly 90-day content and measurement plan

Prepared 8 November 2026. Days are relative to the eventual approved production release; this work does not deploy anything. Priorities are qualitative until Search Console and activation data are available. Each item has a distinct user problem and must be checked against the shipping API before publication.

| Window / priority | Owner | Deliverable | Acceptance and measurement |
|---|---|---|---|
| Days 1–7 / P0 | Engineering + site owner | Complete `SEO_LAUNCH_CHECKLIST.md`, confirm www host and build-time environment, release tested changes | 15 public canonical URLs return 200, actual 308 legacy redirects, unknown paths 404, utility routes noindex, no private data exposed |
| Days 1–14 / P0 | Analytics owner | Verify existing GA4/Vercel ownership, Search Console domain access, and event collection | Filter GA4 by Organic Search and landing page; confirm fixed-name `form_created` and `onboarding_completed` events without PII; preserve pre-release baseline |
| Days 8–21 / P1 | Product + engineering | Review HTML and React/Next.js tutorials with a fresh account on a test website | Follow copied examples through accepted, quarantined, failed, and timed-out responses; use synthetic data; confirm inbox status update |
| Days 15–30 / P1 | Content + engineering | Expand existing HTML guide with a static portfolio quote-request example | Add value to `/docs/html`; custom field names match the actual handler; include validation limitations and production origin checks; no duplicate static-site page |
| Days 15–30 / P1 | Engineering | Investigate public-page JavaScript and font costs using approved browser tests | Live baseline is saved under `artifacts/seo`; profile Clerk, Framer Motion, fonts and both existing analytics tools before changing boundaries; preserve sign-in and keyboard/mobile behavior |
| Days 22–40 / P1 | Engineering + content | Strengthen existing origin troubleshooting examples | Accurate scheme/host/port examples, distinguish 403 vs browser CORS, link `/docs/environments` and `/docs/troubleshooting`; track guide-to-signup journeys |
| Days 31–45 / P1 | Product + content | Add a useful agency quote-enquiry workflow example | Verify workspace isolation, New/Contacted/Qualified, filtered CSV behavior. Extend `/lead-management` unless a distinct task warrants its own guide. Use synthetic contacts, never customer data |
| Days 31–60 / P1 | Analytics + backend owner | Define authoritative signup, first form, and first accepted submission milestones | Clerk signup completion and persisted first successful submission need a deliberate integration; do not infer them from onboarding or HTTP 202. Send counts/booleans only, with deduplication and no lead fields |
| Days 40–60 / P2 | Product owner | Recheck comparison and pricing facts | Revisit linked Formspree sources and current Infraly checkout. Update date only after real review. Publish exact plan limits only after verification |
| Days 45–75 / P2 | Content + developer relations | Publish a tested server validation example or small starter repository | Document secret handling, request body validation, timeouts and duplicate risk. Keep current unsupported uploads/SDKs clear. Add source links from existing guides |
| Days 60–90 / P2 | Partnerships owner | Identify relevant static-site starter maintainers, independent agencies and developer educators | Prepare a useful working example or integration PR for review. Request separate authorization before outreach, external submissions, or contacting anyone. No purchased links or automated outreach |
| Days 75–90 / P1 | SEO + product | Review query clusters, indexing and activation funnel; choose next content investment | Consolidate pages competing for the same intent; prioritize demonstrated questions and useful examples. No arbitrary publication quota or ranking promises |

Weekly: examine Search Console indexing reasons and canonical selection, new crawl errors, organic landing-page clicks/impressions, and signup/activation data when available. Look for failed submissions or unclear setup instructions alongside traffic. Revalidate the sitemap after route changes; keep `lastModified` tied to substantive edits.

Monthly: assess mobile usability, approved lab measurements and available 75th-percentile field data. Targets are LCP <=2.5s, INP <=200ms, CLS <=0.1. A single lab run or SEO score is not evidence of field performance or rankings.

Draft-only until verified: paid plan comparisons, exact quotas, email notifications, file uploads, native third-party integrations, named customers/testimonials, security certifications, guarantees and any unsupported automation. No routes were created for these claims.

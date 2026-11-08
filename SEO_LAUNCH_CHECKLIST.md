# Infraly SEO launch checklist

Prepared 8 November 2026. No deployment, DNS changes, Search Console submission, account creation, or external form submission has been performed.

## Domain and deployment (site owner)

- [ ] Keep `www.infraly.online` as the preferred HTTPS host, matching the current apex-to-www 308. Set `NEXT_PUBLIC_APP_URL=https://www.infraly.online` in the production build environment. Changing the preferred host requires coordinated hosting redirects and canonicals; do not create a www/apex loop.
- [ ] Verify the API's real HTTPS origin and set `NEXT_PUBLIC_API_URL` accordingly. Documentation deliberately shows `YOUR_API_ORIGIN` placeholders when only localhost is configured; never guess a hosted API address.
- [ ] Vercel: production indexing enables automatically when `VERCEL_ENV=production` and the origin is valid. Do not copy the example's `SEO_INDEXING_ENABLED=false` into production unintentionally. Omit that variable or set it to `true` after review. Vercel preview/development always stays noindex even if the flag is true.
- [ ] Standalone hosts: set `NODE_ENV=production` and `SEO_INDEXING_ENABLED=true` for the intended public build and runtime. Leave it false/unset for staging. An invalid, insecure, local or placeholder site origin fails closed: no canonical URLs, empty sitemap, and noindex. Do not deploy one production build artifact into staging with a different indexing policy: rebuild for the target environment.
- [ ] Enforce HTTPS and the primary host at the trusted hosting edge. Repository redirects cover apex -> www and forwarded HTTP on the canonical host. The existing HTTP apex -> HTTPS apex -> HTTPS www chain is an edge setting; collapse it to one hop if the host permits.
- [ ] Re-run client lint/type checks/tests/build and server checks. If OneDrive locks the default frontend output, use a fresh `NEXT_BUILD_DIR` (final verification used `.next-production/seo-verified`) or build from a non-synced checkout. The complete isolated backend suite passed on retry. The full backend build's Prisma generation hit an existing Windows engine DLL lock; stop/restart the owning local server at a suitable time and rerun `npm run build --prefix server`. Backend TypeScript compiled successfully using the existing generated client.
- [ ] After an approved release, run `client/scripts/verify-seo.cjs --indexable` with `SEO_TEST_URL` pointing to the deployment and `SEO_CANONICAL_ORIGIN=https://www.infraly.online`. Its host-header tests are intended for a local Node HTTP target; use local verification for those checks, then inspect real hosting redirects separately.
- [ ] Verify metadata, canonical URLs, sitemap and robots on the actual deployment. Public sitemap contains exactly the 15 canonical public routes. No dashboard, authentication page, API, tracking parameter or redirect alias belongs in it.
- [ ] Confirm utility noindex and unauthenticated dashboard/onboarding redirects. Check real 404s, the social image, keyboard navigation, 320/390px and desktop layouts. Local browser QA was not run because its permission request was rejected; the saved browser script can be run later with authorization and `CHROME_PATH` if needed.
- [ ] Manually verify signup and one synthetic contact submission on an authorized test website, then review and update the lead status. No live form was submitted during this task. Test accepted, quarantine and failure cases. Do not use a workspace secret in browser code.

## Search Console (domain owner)

- [ ] Open Search Console with the intended organization account. Add a domain property for `infraly.online` and follow the actual DNS TXT verification instructions, or use an appropriate URL-prefix property. No verification token has been invented or installed.
- [ ] After ownership verification and deployment, submit `https://www.infraly.online/sitemap.xml` in Sitemaps.
- [ ] Inspect `/`, `/docs/html`, `/docs/react`, `/lead-management`, and `/compare/formspree`: check live rendering, fetch status, noindex absence, declared vs selected canonical and indexing reasons. Request indexing selectively after successful inspection.
- [ ] Check Page indexing, Crawl stats and Core Web Vitals weekly. Record an initial baseline and annotate the actual release date. No external setup is claimed complete.

## Existing analytics and activation (analytics + backend owners)

- [ ] Confirm ownership and consent/privacy requirements for existing GA4 `G-NT8ZP868HF` and Vercel Analytics. No additional tracker was installed. Inspect existing dual collection before retaining or removing either.
- [ ] Confirm GA4 events `form_created` and `onboarding_completed` in an authorized test session. They fire only after successful API responses, send fixed names with no custom data, and must never interrupt the action if analytics is unavailable. These are not authoritative signup or first-submission events.
- [ ] Use Organic Search session channel plus landing page in GA4. Review form creation after the organic landing visit; first observed form creation per anonymous GA user is an approximate funnel metric, not proof of account-wide first form creation.
- [ ] Define signup completion using verified Clerk lifecycle data; define first successful submission from the first persisted accepted lead, with a stable deduplication rule. Quarantined submissions (202) do not count as accepted leads. Implement a separately reviewed integration before marking these milestones instrumented.
- [ ] Never send contact names, emails, messages, raw lead payloads, credentials or workspace/API identifiers to analytics. Audit automatic page-location/query collection, referral exclusions for auth, retention, and consent behavior. Avoid treating ad-blocked client events as complete counts.
- [ ] Field CWV and Search Console/GA4 account data were unavailable. Report lab and field results separately and make no ranking or conversion uplift claims without evidence.

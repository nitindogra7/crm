# Infraly SEO audit and implementation

Audited 8 November 2026. Repository changes only; nothing deployed. The initial working tree was clean. The owner confirmed https://infraly.online; direct live requests show its preferred host is **https://www.infraly.online**. Configuration and canonical URLs follow that existing www host to avoid a hosting redirect loop.

## Application and baseline

Next.js 16.4.1 App Router, React 19.2.8, Tailwind 4, Clerk 7.9.17; separate Express 5.3 API, Prisma 6.19.3 and PostgreSQL. Frontend live responses show Vercel hosting. Backend hosting origin was not established; checked-in/local configuration points to localhost, so no hosted API URL was invented. Build output lives in `.next-production`, separate from the running development server. Installed Next metadata, robots, sitemap and proxy documentation was read before editing.

Live observations (direct HTTP, before changes):

| URL | Status / behavior | SEO observation |
|---|---|---|
| `http://infraly.online/` | 308 -> HTTPS apex | Two-hop path to final www host; hosting edge improvement remains |
| `https://infraly.online/` | 308 -> HTTPS www | Preserve this preferred-host direction |
| `https://www.infraly.online/` | 200, title �Infraly � Every enquiry, in one place� | No canonical; 81,679 response bytes; one H1 and 37 links |
| `https://www.infraly.online/docs` | 200, title �Documentation \| Infraly� | 19,449 bytes; no H1 in the HTTP response; main guide requires JavaScript |
| `https://www.infraly.online/robots.txt` | 404 | Missing |
| `https://www.infraly.online/sitemap.xml` | 404 | Missing |
| `https://www.infraly.online/seo-audit-missing-route` | 404 | Existing not-found behavior is a genuine 404 |

The web browsing provider could not fetch this domain; direct HTTPS requests succeeded. Live and local findings are not interchangeable. Initial local development responses rendered a guide H1 but shared the same Documentation title for `/docs` and `/docs?guide=html`; development behavior did not demonstrate production crawlability. Initial local `/dashboard` correctly redirected unauthenticated users to sign-in.

## Findings, evidence and outcomes

| Severity | Finding / evidence | Implemented fix or remaining action |
|---|---|---|
| High | No absolute canonical identity, sitemap or robots route | Shared validated origin, per-page metadata, framework-native sitemap/robots. 15 public canonical URLs verified successful. Dates reflect the 8 November content revision |
| High | Live docs main content absent from initial HTML; query-driven guides share metadata | Quickstart statically rendered; 11 guide routes generated as static HTML with individual metadata. Search/menu/copy interactions retained |
| High | React streaming can return 200 for a legacy redirect | Documentation proxy returns real 308 responses before rendering; aliases go directly to their final guide. Unknown/malformed guides rewrite to a true 404 with noindex |
| High | Utility/private routes lacked an explicit consistent indexing policy | Noindex metadata and response headers for auth, onboarding and dashboard routes; every Express API response also noindex. Existing Clerk and workspace authorization retained; anonymous management API GETs verified 401 |
| High | Preview/staging must not inherit production indexing | Vercel preview wins over an explicit true indexing flag. Standalone production requires explicit opt-in. Preview HTTP verification passed with noindex headers/meta and an empty sitemap |
| Medium | Homepage does not clearly name the form backend; signup CTAs detour through private dashboard | Updated H1/copy, direct primary signup links, contextual links to real guides, lead management and comparison |
| Medium | Unverified $5/$12 future pricing; proposed paid features already work in the current app | Removed future numeric prices and unverified entitlements. Existing Free signup retained. Pricing stays in the homepage section to avoid a thin duplicate page |
| Medium | Need distinct lead-workflow and comparison content | Added `/lead-management` and `/compare/formspree`. Synthetic workflow example, dated official comparison sources, explicit limitations and useful setup next steps |
| Medium | Integration examples need validation and error context | Improved existing HTML and React/Next.js guides. Explicit endpoint placeholders, honeypot, 202 quarantine vs 200 acceptance, 1 MB parser limit, 403/429 guidance, timeout/duplicate risk and production origins. Full configured required-field schema is NOT enforced by current ingestion and is not claimed |
| Medium | Missing social metadata and entity relationships | Unique OG/Twitter metadata, generated 1200x630 social image, Organization/WebSite graph on home and BreadcrumbList on content/docs. JSON-LD safely escapes less-than characters and parses as JSON |
| Medium | Activation measurement not defined | Reused existing GA4 with fixed `form_created` and `onboarding_completed` events after successful API responses. No lead details/custom parameters. Authoritative signup and first accepted submission instrumentation remains an explicitly documented follow-up |
| Medium | Public JavaScript / mobile performance | Live lab baseline saved. Static generation removes documentation's initial client content dependency; new content pages use server components. Remaining JS/font/Clerk profiling needs approved local browser QA; no field pass or numerical speedup claimed |
| Low | 404 sends visitors to an authenticated page; footer �Privacy & security� points to generic docs | 404 now links home; footer accurately labels the spam guide. Owner-approved privacy/legal pages remain future work |

Capabilities verified in code and isolated QA: public form submission URLs; custom extra fields; multiple owned workspaces; development/production isolation; lead inbox; New/Contacted/Qualified status changes; source/form/status/date filters; bulk status/delete; filtered CSV export; quarantine and rescue. Submission API keys stay server-side; no uploads, SDKs, automatic replies, paid checkout, customer metrics, certifications or unverified integrations are promised.

## Route inventory

The following inventory is generated from actual local production HTTP output; it is not a claim about an already deployed release. Canonical host is `https://www.infraly.online`. Each public route has one H1, a unique title/description and full content in its initial HTML. Static pages may still hydrate interactive components. Every guide is linked by the documentation sidebar and related-guide navigation; new landing pages are linked by the homepage footer and contextual guide links.

| URL | Purpose | HTTP | Indexability | Canonical | Rendering | Internal links |
|---|---|---|---|---|---|---|
| `/` | Product discovery and signup | 200 | index, follow | https://www.infraly.online | Static + hydration | 39 outgoing; home/content links inbound |
| `/docs` | Quickstart and guide navigation | 200 | index, follow | https://www.infraly.online/docs | Static + hydration | 42 outgoing; docs navigation inbound |
| `/lead-management` | Website enquiry follow-up workflow | 200 | index, follow | https://www.infraly.online/lead-management | Static + hydration | 18 outgoing; home/content links inbound |
| `/compare/formspree` | Workflow comparison and migration evaluation | 200 | index, follow | https://www.infraly.online/compare/formspree | Static + hydration | 20 outgoing; home/content links inbound |
| `/docs/ai-agent` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/ai-agent | SSG + hydration | 30 outgoing; docs navigation inbound |
| `/docs/website-builders` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/website-builders | SSG + hydration | 31 outgoing; docs navigation inbound |
| `/docs/html` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/html | SSG + hydration | 34 outgoing; docs navigation inbound |
| `/docs/react` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/react | SSG + hydration | 32 outgoing; docs navigation inbound |
| `/docs/server` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/server | SSG + hydration | 28 outgoing; docs navigation inbound |
| `/docs/fields` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/fields | SSG + hydration | 24 outgoing; docs navigation inbound |
| `/docs/environments` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/environments | SSG + hydration | 24 outgoing; docs navigation inbound |
| `/docs/spam` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/spam | SSG + hydration | 24 outgoing; docs navigation inbound |
| `/docs/responses` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/responses | SSG + hydration | 24 outgoing; docs navigation inbound |
| `/docs/glossary` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/glossary | SSG + hydration | 25 outgoing; docs navigation inbound |
| `/docs/troubleshooting` | Integration or reference guide | 200 | index, follow | https://www.infraly.online/docs/troubleshooting | SSG + hydration | 24 outgoing; docs navigation inbound |
| `/sign-in` | Authentication utility | 200 | noindex, nofollow | None | Dynamic Clerk utility | Marketing/navigation links |
| `/sign-up` | Authentication utility | 200 | noindex, nofollow | None | Dynamic Clerk utility | Marketing/navigation links |
| `/dashboard`, `/dashboard/analytics`, `/dashboard/forms`, `/dashboard/leads`, `/dashboard/spam`, `/dashboard/settings`, `/onboarding` | Private app and setup | 307 to sign-in when anonymous | noindex, nofollow | None | Authenticated dynamic | Utility navigation; excluded from sitemap |
| `/login`, `/signup` | Preserved utility aliases | 308 | Redirect; excluded | Destination utility page | Config redirect | Legacy links retained |
| `/docs?guide=?`, guide aliases | Preserved guide URLs | 308; invalid guides 404 | Redirect; excluded | Final guide path | Proxy before render | Existing external links retained |
| `/seo-missing-route`, unknown guide paths | Not found | 404 | noindex | None | 404 HTML | Homepage recovery link |
| `/robots.txt`, `/sitemap.xml` | Crawl discovery | 200 | Not HTML search pages | n/a | Static metadata handlers | robots advertises production sitemap |
| `/social-preview`, `/favicon.ico`, `/logo.svg`, `/apple-touch-icon.png`, `/manifest.webmanifest` | Social image and identity assets | Social preview 200 verified; existing icon/manifest assets retained | Assets; excluded from sitemap | n/a | Static/file responses | Metadata references |
| Express management APIs / public submission endpoints | Private management / public ingestion | Management GET 401; submission regression suite passes | X-Robots-Tag noindex, nofollow | None | Express | No sitemap entries; authorized app or form clients |

| URL | Title | Description | H1 |
|---|---|---|---|
| `/` | Form backend and website lead management \| Infraly | Connect HTML, React, and Next.js forms to Infraly. Capture enquiries, review spam, and manage lead statuses in one inbox without building a form backend. | Your website forms. Your leads, in one place.  |
| `/docs` | Form backend documentation and quickstart \| Infraly | Create a form endpoint, connect your website, and review your first lead. Setup guides for HTML, React, Next.js, server requests, and spam protection. | Your first lead, in 3 steps |
| `/lead-management` | Website lead management for form submissions \| Infraly | Turn website form submissions into a clear follow-up list. Review contact details, filter leads, update statuses, and keep spam separate with Infraly. | Website lead management, from enquiry to follow-up |
| `/compare/formspree` | Infraly vs Formspree: choosing a form backend \| Infraly | Compare Infraly's website lead workflow with Formspree's form backend, submission inbox, exports, and integrations. A source-backed comparison of different needs. | Infraly vs Formspree: choose your form workflow |
| `/docs/ai-agent` | Let AI connect your form \| Infraly | Paste your form URL. Copy the prompt. Give it to your website?s AI assistant. | Let AI connect your form |
| `/docs/website-builders` | Using a website builder? \| Infraly | You need a form that can send messages to a custom URL. | Using a website builder? |
| `/docs/html` | HTML contact form without a backend \| Infraly | Submit directly from your website with a standard HTML form and no client-side JavaScript. | HTML contact form without a backend |
| `/docs/react` | React and Next.js contact form integration \| Infraly | Keep visitors on your page and handle accepted, quarantined, and failed submissions explicitly. | React and Next.js contact form integration |
| `/docs/server` | Server integrations \| Infraly | Send submissions from a backend with an environment-specific API key. | Server integrations |
| `/docs/fields` | Fields & payloads \| Infraly | Understand core fields, custom values, and the difference between a form definition and submission validation. | Fields &amp; payloads |
| `/docs/environments` | Environments & origins \| Infraly | Keep test data separate and configure which websites can submit to production endpoints. | Environments &amp; origins |
| `/docs/spam` | Spam protection \| Infraly | Understand which submissions are quarantined and how to review legitimate messages. | Spam protection |
| `/docs/responses` | Responses & errors \| Infraly | Reference for JSON submission responses and the steps to take when a request is rejected. | Responses &amp; errors |
| `/docs/glossary` | Words explained \| Infraly | The terms you will see in Infraly, explained in everyday language. | Words explained |
| `/docs/troubleshooting` | Quick fixes \| Infraly | Fix missing form submissions, blocked origins, empty fields, thank-you redirects, and duplicate enquiries in Infraly. | Quick fixes |
| `/sign-in` | Sign in \| Infraly | Sign in to access your Infraly form endpoints and workspace. | ? |
| `/sign-up` | Sign up \| Infraly | Create your Infraly developer account and generate form endpoints. | ? |

Protected responses redirect before page HTML; they therefore have no returned title, description or H1 for anonymous crawlers. Utility title and description values were also inspected in the returned HTML; their Clerk widgets supply interactive headings after load. The metadata table records all public-page values from actual returned HTML.

## Verification

- Client production and preview builds passed. Final production verification used `NEXT_BUILD_DIR=.next-production/seo-verified` after OneDrive blocked cleanup of the usual output directory (EPERM); no application files were deleted. Next reports the homepage, quickstart, lead-management and comparison as static, and guide paths as SSG.
- Client lint and type checking passed; all 29 client unit/regression tests passed, including five new SEO tests (indexing environment matrix, invalid origins, safe JSON-LD serialization, existing guide/alias/link destinations, redirect-loop prevention).
- Production HTTP verifier passed 15 public routes plus sign-in/sign-up; 21 distinct internal targets checked. It verifies distinct metadata, canonicals, H1s, social URLs, sitemap inclusion, structured JSON, redirects, tracking canonicals, genuine 404s, protected routes and social PNG responses. Saved in `artifacts/seo/production-http.json`.
- Preview verifier passed the same pages with `VERCEL_ENV=preview` and `SEO_INDEXING_ENABLED=true`: noindex still wins and no URLs are emitted by the sitemap. Saved in `artifacts/seo/preview-http.json`.
- Server type checking and TypeScript emission passed. Full `npm run build --prefix server` attempted: Prisma generation hit EPERM renaming its Windows engine DLL while an existing server holds it. This is a remaining local build prerequisite, not a skipped successful result.
- Complete isolated backend suite passed on retry: migrations/schema comparison; lead capture; HTTP ingestion; performance regression; security/spam; origins; production invariants; dashboard read models. The initial run lost its database connection after 65 successful checks; retry succeeded and both temporary schemas were removed. Existing development data was not used as the test dataset.
- Anonymous local management APIs `/api/leads`, `/api/forms`, `/api/dashboards` returned 401 with `X-Robots-Tag: noindex, nofollow`.
- `git diff --check`: passed. No deployment, external submission, email or outreach performed.

### Performance and visual evidence

`artifacts/seo/live-lab.json` and live mobile screenshots contain the before-release browser baseline: Chrome headless, 390x844, 4x CPU slowdown, 100ms simulated latency, 1.6Mbps download, cold cache; GA/Vercel collection blocked to avoid test analytics. Single observations: homepage LCP 5.056s / CLS 0, HTML guide after client rendering LCP 2.944s / CLS 0. Homepage resource transfer ~750 KB, guide ~657 KB; these include browser resource measurements and are not JS-only bundle sizes. The guide had main-container horizontal overflow in that baseline. Neither observation proves field CWV; INP was not measured. Current target remains 75th percentile LCP <=2.5s, INP <=200ms and CLS <=0.1.

After implementation, the production HTML for `/docs` contains its H1, steps and guide links (34,461 bytes in the recorded run); `/docs/html` contains its real guide, code and related links (34,792 bytes). These demonstrate content delivery, not a measured LCP improvement. Local loopback HTTP timings in the evidence are not comparable to live delivery or user performance.

Not run: local mobile/desktop browser screenshots, interactive guide navigation and keyboard checks, because the local headless-browser permission request was rejected. The reproducible browser script is saved at `client/scripts/measure-seo.cjs` for an authorized follow-up. Manual real signup and website submission were not run: no external form submission or test account action was authorized. API submission behavior was covered with isolated synthetic fixtures. Google Rich Results Test and Schema Markup Validator external submissions were not run; local JSON parsing/serialization and visible-content matching were checked. Search Console, CrUX/field data and analytics dashboards were unavailable.

## Research and structured data decisions

Official competitor research reviewed on 8 November 2026: [homepage](https://formspree.io/), [pricing](https://formspree.io/plans), [documentation](https://help.formspree.io/), [guides](https://formspree.io/guides/), [Next.js integration](https://formspree.io/guides/nextjs/), [exports](https://help.formspree.io/articles/form-and-project-settings/exporting-submissions/), [CRM/service plugins](https://help.formspree.io/sections/plugins/). Formspree has an inbox, exports and CRM plugins; the public comparison acknowledges these. No competitor price figure is hardcoded.

Intent priorities are qualitative and consolidated in `SEO_KEYWORD_MAP.md`. No search-volume or ranking claim was fabricated. Structured data is limited to entities supported by the visible site and breadcrumb navigation. [Google's software app requirements](https://developers.google.com/search/docs/appearance/structured-data/software-app) require a rating or review for its software-app rich result; no such verified data exists here, so no offers/review/app rich-result markup was invented. The FAQ documentation URL currently redirects to [Search documentation updates](https://developers.google.com/search/updates); no FAQ rich-result markup or eligibility promise was added.

## Remaining release and owner actions

Follow `SEO_LAUNCH_CHECKLIST.md`: verify production www/app/API environment settings, authorize a release, recheck the live domain, finish manual signup/submission and mobile QA, resolve the local Prisma DLL lock for a full server build, and complete Search Console/analytics setup using actual account access. Retain the current edge host direction; optimize the two-hop HTTP apex redirect at the hosting edge if possible. Publish approved privacy terms separately when available. `SEO_CONTENT_PLAN.md` contains the prioritized 90-day backlog. No rankings, organic growth or conversion uplift is promised.

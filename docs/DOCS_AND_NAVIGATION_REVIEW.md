# Documentation and navigation update

- Loading bars are opt-in for header/sidebar navigation. The bar is rendered in a portal at the document body so transformed links cannot contain it. Ordinary cards and buttons do not render a loading bar. Removed the automatic workspace/global bars and 22 animated action spinners; disabled controls and saving/creating text remain.
- The dashboard sidebar uses a restrained navy-blue gradient, readable navigation, and a translucent workspace switcher. Navigation and workspace actions are preserved.
- Rebuilt /docs with a fixed desktop header/sidebar, an independently scrolling article, an on-page index, and an accessible mobile drawer. Replaced the dark hub/cards with a consistent light documentation layout.
- Nine guides cover setup, HTML forms, React/JavaScript, server integrations, fields, environments/origins, spam protection, responses, and troubleshooting. Content was checked against the submission controller/service, routes, request parsers, origin middleware, and rate limiters.
- Removed unsupported claims about deduplication, scoring, real-time updates, large disposable-domain lists, webhook delivery, and request-level _next redirects. Examples use the configured backend URL. Multipart/file uploads are explicitly documented as unsupported. Examples distinguish HTTP 202 quarantine from clean success.
- Search supports keyboard shortcuts and empty states. Guide links preserve browser history and older guide IDs. Copy controls confirm actual clipboard success and expose errors. Text contrast and mobile code sizing were reviewed.

## Verification

- 10 browser checks passed with no page errors. Results: artifacts/ui-review-v2/results.json.
- All nine guides fit 320, 390, 1024, and 1440 px widths (36 combinations). After typography adjustments, key guides were checked again at 320, 390, and 1440 px.
- Verified fixed navigation while scrolling, local guide changes/browser Back, search, copy denial/success, mobile focus containment/Escape, legacy/unknown guides, gradient sidebar, ordinary links without loading bars, and navigation progress portaled outside a transformed link.
- Parsed the TypeScript/JSX and JSON code examples and checked cURL JSON bodies and configured endpoint interpolation. No real lead submissions were sent.
- npm test passed: ESLint, TypeScript, and all six existing regression tests. Production build passed. The temporary unauthenticated UI preview was removed before the build.
- Screenshots are in artifacts/ui-review-v2/.

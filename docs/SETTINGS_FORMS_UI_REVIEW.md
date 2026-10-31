# Settings, forms, and landing-page update

## Interface changes

- Rebuilt all five settings sections using shared panel, field, action, and switch components. Settings uses the existing sidebar with only five section links and a Back to workspace link, from the top. Branding, workspace switching, Docs, and the profile footer are hidden in settings. The content uses the same centered max-width as other dashboard pages, with no additional navigation or selector.
- Simplified environment descriptions, removed the architecture badge and misleading verification language, separated the production-origin form from its optional checker, and aligned all controls and footers.
- General settings preserve profile saving and workspace switching. New workspace creation uses the shared dialog layout and valid backend accent choices.
- Notifications, webhooks, and delivery history use concise descriptions and accurately indicate delivery availability. Existing preference storage behavior is preserved; this work does not add outbound email or webhook dispatch.
- Settings is now an accessible icon beside the profile in the dashboard sidebar footer. Removed Settings from the main menu and removed the Website link. Docs remains available.
- Rebuilt the forms list, API-key view, integration view, create-form dialog, and all four form-detail tabs. Advanced creation options are collapsed, copy controls are aligned, and action text retains the existing no-spinner behavior.
- Integration examples are shared between forms screens and use public browser submissions or server environment variables as appropriate. Removed hidden-DevTools claims and preserved HTTP status when showing server proxy examples. Clearing a form redirect now sends an empty value so it can be removed.
- Landing Login links target /dashboard on desktop and mobile. Authentication protection still applies to signed-out visitors.
- Pricing cards use the app's actual capture, inbox, spam review, analytics, environment, workspace, and API features. Existing $99/$139/$199 price amounts are preserved. The cards identify paid checkout as a preview because billing is not implemented.
- Removed all four testimonial profile images while preserving the quote, name, and role content.

## Verification

- 13 browser checks passed with no page errors. Results: artifacts/ui-review-v3/results.json.
- Checked all five settings sections and three forms views at 320, 390, 1024, and 1440 pixels: 32 viewport/tab combinations.
- Checked local tab navigation and browser Back, the collapsed origin checker, mobile switches and section selector, form-detail tabs, create-form field creation by keyboard, workspace dialog alignment, and forms/API-key empty states.
- Confirmed the icon-only Settings shortcut and Website removal, both landing Login destinations, zero testimonial images, supported pricing copy, and aligned pricing actions.
- Parsed the React, server-route, Node, and cURL examples; browser examples do not embed an API key.
- UI browser checks used temporary sample data and did not exercise real authenticated saves or send lead submissions. The preview route was removed after verification.
- Screenshots are in artifacts/ui-review-v3/.

Final checks passed: ESLint with no warnings, TypeScript, all six existing regression tests, the production frontend build, and git diff --check. The temporary preview is absent from the build route list.

## Shared sidebar follow-up

- Only the sidebar for the current viewport mounts, so desktop and mobile no longer mount separate Clerk profile controls simultaneously. The dashboard footer does not shrink, respects mobile safe areas, and uses a larger profile control.
- Desktop (1440px) and mobile (390px) browser checks confirmed six settings links, no extra controls or footer in settings, one mounted sidebar, active section updates, drawer closing after selection, visible dashboard footer, and no horizontal overflow or page errors. Results: artifacts/ui-review-v4/results.json.
- The sample-only preview was removed. Signed-in Clerk avatar behavior requires an authenticated session and was not exercised in the anonymous browser.

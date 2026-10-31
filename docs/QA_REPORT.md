# QA review - 1 November 2026

This review covers the current working tree, including changes that were already uncommitted when QA began. The code has not been committed, pushed, or deployed.

## Fixes

- Upgraded Next.js and its ESLint config to 16.4.1. Updated Express and its transitive body-parser/qs packages. Prisma CLI and tsx are build/development dependencies; production runs compiled JavaScript.
- Replaced the client test script's unconditional success message with actual lint and type checks. Added a root `npm run qa` command.
- Made server builds emit `dist/` and changed production startup to `node dist/index.js`.
- Restricted ingestion aliases to POST. Malformed JSON returns 400, excessive bodies return 413, and parser failures do not log submitted bodies.
- Required an API key's environment to match its target form. Unknown forms return 404 instead of silently creating unlinked leads.
- Removed API credentials from stored quarantine payloads and lead extra fields.
- Unified origin matching between middleware and ingestion. Explicit origins include their scheme and port. Origin lookup failures reach the error handler; dynamic responses use `Vary: Origin` and `Cache-Control: no-store`.
- Made HTML body credentials available to production origin checks, and used Express's trusted-proxy IP resolution for submission metadata.
- Rejected invalid workspace IDs instead of falling back to a different workspace. Permission failures return 403.
- Made simulated lead insertion and counter updates one transaction. Simulations inherit the form's environment.
- Changed bulk deletion to count rows returned by DELETE, preventing overlapping requests from decrementing counters twice. Updates lock forms in a consistent order.
- Qualified raw SQL with the configured PostgreSQL schema. Previously, raw queries could operate on public tables while Prisma used another schema.
- Added global form-slug uniqueness to match public URL routing, required environment columns, valid-environment checks, and nonnegative counters. Corrected index names and API-key defaults in migration history.
- Rejected malformed redirects, protocol-relative redirects, and backslash/control-character redirects.
- Prevented stale dashboard fetches from overwriting a newly selected workspace or environment. Cleared previous workspace records before loading and surfaced partial failures.
- Separated production Next.js output into `client/.next-production/` to avoid conflicts with a running development server.
- Added PostgreSQL-backed regression tests, migration application/drift checks, production dependency audits, and server builds to CI.

## Verified results

| Check | Result |
| --- | --- |
| Backend suites | 146 assertions passed across six suites |
| Migration history | All seven migrations applied to an empty temporary schema |
| Schema drift | No difference detected after migration |
| Frontend | Next.js 16.4.1 production build passed; lint and TypeScript passed |
| Backend build | Prisma generation and TypeScript compilation passed after briefly restarting the dev worker |
| Compiled API smoke test | Readiness 200, unauthenticated lead access 401, GET ingestion 405 |
| Frontend runtime smoke test | Home, docs, manifest, sign-in, and sign-up returned 200; dashboard/onboarding redirected unauthenticated requests (307); missing route returned 404 |
| Production dependency audits | Zero known advisories in both pnpm production dependency graphs |
| Lockfiles | Both pnpm frozen-lockfile checks passed; existing client npm lockfile synchronized |

The expected database errors printed by the new regression suite are deliberate checks of uniqueness and CHECK constraints. The temporary QA schemas were removed. The existing backend watcher resumed after build verification. Development-only dependencies were not certified vulnerability-free.

## Reproduce

Use a QA PostgreSQL connection in `server/.env`. Install each package with its checked-in pnpm lockfile.

```sh
npm run qa
```

The server's `npm run test:isolated` command creates a random `crm_qa_*` schema, applies the complete migration history, verifies schema drift, runs the suites, and removes that schema in a finally block. It requires permission to create and drop schemas. Ordinary `npm test` from `server/` uses the configured schema directly and expects migrations to be applied first.

Stop the backend development process before regenerating Prisma on Windows: its loaded query-engine DLL can prevent Prisma from replacing generated files. Production Next.js startup uses the same `.next-production` directory as the build.

## Diagnostic credential exposure

An early failed migration-diff diagnostic included DATABASE_URL in its child-process error output. The runner now avoids passing connection URLs as command arguments and does not echo child-process command text on failure. Rotate that database credential before deployment.

## Deployment notes

The new migration has been exercised only in disposable QA schemas; it has not been applied to the application's configured schema. Back up the target database and check for conflicting public form URLs before deployment:

```sql
SELECT slug, COUNT(*) FROM forms GROUP BY slug HAVING COUNT(*) > 1;
```

Resolve duplicates deliberately; the migration fails rather than renaming existing public URLs. Existing invalid environment values or negative counters also require review before the new constraints can be applied.

Build with development dependencies available, apply migrations with `pnpm --dir server db:deploy`, and start the compiled API with `pnpm --dir server start`. Prisma CLI is needed for the migration step, before any production dependency pruning. Configure `NODE_ENV=production`, `FRONTEND_URL`, `API_URL`, Clerk keys, and each production workspace's origin for the deployment.

## Remaining release work

- Authenticated browser journeys through Clerk, onboarding, workspace switching, and destructive actions still need end-to-end testing against staging. Static checks and HTTP/service tests do not establish browser behavior.
- API keys remain recoverable in the database because the existing UI supports revealing/copying them after refresh. A one-time-display, hashed-key design needs a coordinated API/UI change before treating database readers as unable to impersonate API clients.
- Webhook and notification settings are local client state; this pass does not implement delivery, retries, or email notifications.
- Full lead/spam listing still loads a workspace's entire history. Large deployments need server-driven pagination throughout the UI.
- Rate-limit state is process-local, and the API assumes one trusted proxy hop. Multi-instance deployments need a shared limiter store and proxy settings matched to the hosting topology.
- No sustained load test, backup restore exercise, or live deployment verification was performed.

## Security references

- [Next.js image optimization advisory and patched versions](https://github.com/advisories/GHSA-2464-fhr4-w9xw)
- [body-parser advisory and patched versions](https://github.com/advisories/GHSA-27r3-jxmh-p828)

These are release limits, so this review does not certify the entire product as production-ready.

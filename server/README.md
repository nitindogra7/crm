# Salenova API

Express 5, TypeScript, Prisma 6, PostgreSQL, and Clerk authentication.

## Development

From `server/`, install dependencies with `pnpm install --frozen-lockfile`, copy `.env.example` to `.env`, and configure the database and Clerk keys. Use `pnpm db:migrate` for local database development, then `pnpm dev`.

Source is split into onboarding, forms/API keys, and leads modules under `src/modules/`. Each module contains routes, controllers, validation, services, and repository queries.

## Production

Build with development dependencies installed:

```sh
pnpm build
pnpm db:deploy
pnpm start
```

The build generates Prisma Client and compiles TypeScript into `dist/`. Startup runs `node dist/index.js`. Apply migrations before pruning development dependencies; the migration CLI is a development dependency.

Set `NODE_ENV=production`, `DATABASE_URL`, `FRONTEND_URL`, `API_URL`, and Clerk keys in the hosting environment. The API currently trusts one reverse-proxy hop.

## QA

```sh
pnpm typecheck
pnpm test:isolated
pnpm audit --prod
```

The isolated runner applies every migration in a random temporary PostgreSQL schema, checks schema drift, runs the backend regression suites, and removes that schema. It requires schema create/drop permissions. `pnpm test` instead runs against the configured schema, which must already be migrated.

On Windows, stop the backend dev worker before generating Prisma Client if its query-engine DLL is locked.

See [the QA report](../docs/QA_REPORT.md) for verified fixes, deployment notes, and remaining release work.

## Main endpoints

- `GET /health`: database-backed readiness check.
- `POST /api/forms-and-api/f/:slug`: public form submission.
- `POST /api/forms-and-api/submit/:formId`: submission by form ID.
- `POST /api/v1/leads`: API-key ingestion.
- `/api/onboarding`, `/api/leads`, `/api/forms-and-api/dashboards`, `/api/forms-and-api/forms`, `/api/forms-and-api/keys`: authenticated management routes.

## API latency

Overview data loading uses three database queries (previously seven), with one grouped scan for lead totals, sources, forms, and status. Stats use one database statement. Public ingestion reuses exact-match form/key/workspace records from CORS within the current request; records are never cached across requests. API key last-used timestamps are approximate to one minute. Formless lead inserts skip unnecessary transactions.

Apply the new indexes with pnpm db:deploy before evaluating list performance. Index deployment is separate from code deployment and can lock writes while indexes are built; schedule appropriately for large tables.

All HTTP responses include Server-Timing: app;dur=... measuring server processing to response headers, including authentication and database waits. It excludes client network time and response-body transfer. Compare warm p50/p95 values in a production build.

For an isolated before/after overview benchmark, set BENCHMARK_API=1 and run npm run test:isolated. The benchmark alternates old/new query shapes and reports database SELECT 1 latency separately. It uses a small fixture and excludes HTTP/token verification; it does not establish production or large-data latency.

A 100 ms end-to-end target cannot be guaranteed when a single database round trip already exceeds that budget. No additional external service is introduced.

Measured from the development machine against the existing remote PostgreSQL database (12 warm, alternating samples per variant; 12 development leads, one production lead, four spam records):

| Measurement | Old overview | Optimized overview |
| --- | ---: | ---: |
| Mean | 252.0 ms | 207.0 ms |
| p50 | 248.9 ms | 173.7 ms |
| p95 | 340.6 ms | 324.3 ms |

Database SELECT 1 alone (six warm samples): mean 91.5 ms, p50 78.5 ms, p95 156.1 ms. These service measurements exclude HTTP/token verification and are not measurements of every endpoint. The sub-100 ms goal remains unverified and was not achieved by the measured overview. Production data and concurrency require a separate benchmark.

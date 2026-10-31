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

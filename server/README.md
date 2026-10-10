# ⚙️ Salenova Backend API

The core REST API and data ingestion service for **Salenova**, built with Express 5, TypeScript, Prisma ORM, and PostgreSQL 16.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js 22 LTS](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **TypeScript Runner**: [tsx](https://github.com/privatenumber/tsx)
- **Security & Utilities**: Helmet, CORS, Cookie-Parser, Morgan, BcryptJS, JSON Web Tokens
- **Containerization**: Docker & Docker Compose

---

## 📂 Directory Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Database schema models (Form, Submission)
│   ├── migrations/            # Version-controlled migration history
│   └── config.ts              # Prisma CLI configuration
│
├── src/
│   ├── index.ts               # Express entry point, health checks, server bootstrap
│   ├── core/                  # Core domain utilities, errors, and configuration
│   └── module/                # Feature modules (forms, submissions, auth)
│
├── Dockerfile                 # Production multi-stage Docker build
├── docker-compose.yml         # Local stack orchestration (PostgreSQL + API)
├── package.json               # Backend dependencies & Prisma scripts
└── .env.example               # Environment variables template
```

---

## 🚀 Getting Started

### 1. Install Dependencies

From the `server/` directory:

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Verify your database credentials:
```env
PORT=4000
FRONTEND_URL=http://localhost:3000
POSTGRES_USER=salenova
POSTGRES_PASSWORD=salenova_dev_pw
POSTGRES_DB=salenova
DATABASE_URL="postgresql://salenova:salenova_dev_pw@localhost:5433/salenova?schema=public"
```

---

### 3. Start Database (Docker)

Start the PostgreSQL service in detached mode:

```bash
docker compose up db -d
```

The database container maps internal port `5432` to host port `5433` to prevent conflicts with local Postgres installations.

---

### 4. Apply Migrations & Generate Prisma Client

```bash
# Apply migrations to PostgreSQL
pnpm run db:migrate

# Generate client types
pnpm run db:generate
```

---

### 5. Start the Server

```bash
pnpm run dev
```

The API will be available at [http://localhost:4000](http://localhost:4000).

---

## 📜 Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `pnpm run dev` | `tsx watch src/index.ts` | Runs the server with live TypeScript reloading |
| `pnpm run start` | `tsx src/index.ts` | Runs the server in production mode |
| `pnpm run db:generate` | `prisma generate` | Generates type-safe Prisma client bindings |
| `pnpm run db:migrate` | `prisma migrate dev` | Creates and applies new migrations in dev |
| `pnpm run db:deploy` | `prisma migrate deploy` | Executes pending migrations (used in CI/CD) |
| `pnpm run db:studio` | `prisma studio` | Opens the web GUI for database inspection |

---

## 📡 Endpoints

- **`GET /health`**: Validates server uptime and verifies direct connection to PostgreSQL via `SELECT 1`.
  - Returns: `{ "ok": true }`
- **`POST /f/:formId`**: *(Under active development)* Ingests incoming form payload, validates honeypots, and records submission.

For full API documentation, see [`docs/API_DOCUMENTATION.md`](../docs/API_DOCUMENTATION.md).

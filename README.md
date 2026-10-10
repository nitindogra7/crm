<div align="center">

# ⚡ Salenova

**Developer-First Form Backend & Modern CRM Lead Capture Platform**

*Capture every lead without building a backend.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg?style=for-the-badge)](LICENSE)

<br />

[Features](#-key-features) •
[Quickstart](#-quick-start) •
[Architecture](#-system-architecture) •
[Documentation](#-documentation-index) •
[API Reference](#-api-quick-reference) •
[Roadmap](#-roadmap)

</div>

---

## 🌟 Overview

**Salenova** is a high-performance, developer-centric form handling and CRM engine designed to turn any web form into an actionable lead capture pipeline with zero backend boilerplate.

Instead of writing repetitive backend route handlers, wiring up SMTP credentials, or managing database schemas for simple contact and demo forms, developers can point their HTML form action or JavaScript `fetch()` request directly to Salenova.

Salenova instantly handles:
- **Intelligent Spam Defense**: Invisible honeypots, rate-limiting, and disposable email detection.
- **Lead Disposition Tracking**: Automatic classification (`accepted`, `spam`, `rate_limited`).
- **Flexible Data Store**: Dynamic JSON payloads backed by PostgreSQL and Prisma ORM.
- **Modern User Experience**: A sleek, dark-mode landing page, live interactive playground, and owner onboarding flow built with Next.js 16 and Tailwind CSS v4.

---

## 🎯 Key Features

| Feature | Description |
| :--- | :--- |
| **Zero Backend Boilerplate** | Deploy one endpoint to receive leads from landing pages, static sites, or mobile apps. |
| **Spam & Bot Shield** | Built-in honeypot validation and rate limiting keep low-quality bot entries out of your CRM. |
| **Real-time Dispositioning** | Every submission is audited and tagged with a disposition (`accepted`, `spam`, etc.). |
| **Universal Form Ingestion** | Works seamlessly with standard HTML forms, React/Next.js, fetch requests, or cURL. |
| **Modern Stack & High Velocity** | Powered by Next.js 16 (React 19 compiler), Express 5, Prisma 6, and Docker Compose. |
| **Developer Ergonomics** | Type-safe schemas, interactive live testing widget, and CLI-ready workflow. |

---

## 🏗️ System Architecture

Salenova is structured as a modular monorepo containing a modern Next.js client and an Express TypeScript backend API.

```
                    ┌──────────────────────────────────────────────┐
                    │                 Client Apps                  │
                    │  (HTML Form / Next.js / Static Site / cURL)  │
                    └──────────────────────┬───────────────────────┘
                                           │
                                     HTTP POST / JSON
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │            Salenova Backend API              │
                    │            (Express 5 + TypeScript)          │
                    ├──────────────────────────────────────────────┤
                    │  1. CORS & Security Headers (Helmet)         │
                    │  2. Spam / Honeypot Inspection               │
                    │  3. Disposition Assignment                   │
                    └──────────────────────┬───────────────────────┘
                                           │
                                    Prisma ORM Client
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │            PostgreSQL 16 Database            │
                    │   - Form Registry (Form)                     │
                    │   - Submissions & Payloads (Submission)      │
                    └──────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
crm/
├── client/                      # Next.js 16 Frontend Application
│   ├── src/
│   │   ├── app/                 # Next.js App Router ((marketing), (auth)/signup, layout)
│   │   ├── features/            # Feature-Sliced modules
│   │   │   ├── auth/            # Owner onboarding & signup components, schemas
│   │   │   └── marketing/       # Interactive landing page, 3D cards, hero, pricing
│   │   └── shared/              # Reusable UI primitives, utilities, and icons
│   ├── package.json             # Frontend dependencies & Next scripts
│   └── next.config.ts           # Next.js compiler & build configuration
│
├── server/                      # Express 5 Backend API & Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma models (Form, Submission)
│   │   └── migrations/          # Version-controlled SQL migrations
│   ├── src/
│   │   └── index.ts             # Express server entry point & health check
│   ├── Dockerfile               # Production container image definition
│   ├── docker-compose.yml       # PostgreSQL 16 + API local stack orchestration
│   └── package.json             # Server dependencies & Prisma scripts
│
├── docs/                        # Complete Project Documentation Suite
│   ├── ARCHITECTURE.md          # In-depth system architecture & security model
│   ├── API_DOCUMENTATION.md     # Full REST API endpoint specification
│   ├── DATABASE_SCHEMA.md       # Prisma models, ER diagrams & migration guide
│   ├── LOCAL_SETUP.md           # Step-by-step developer environment setup
│   └── CONTRIBUTING.md          # Contribution guidelines & Git flow standards
│
├── .github/                     # GitHub workflows, templates & automations
│   ├── workflows/ci.yml         # Continuous integration checks
│   ├── PULL_REQUEST_TEMPLATE.md # Standard pull request template
│   └── ISSUE_TEMPLATE/          # Bug report and feature request templates
│
└── README.md                    # Project README (You are here)
```

---

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **pnpm**: `v9.x` or `v10.x` (`npm install -g pnpm`)
- **Docker & Docker Compose** (Optional, recommended for PostgreSQL)

---

### 2. Clone and Configure Environment

```bash
# Clone the repository
git clone https://github.com/nitindogra7/crm.git
cd crm

# Configure Server Environment
cp server/.env.example server/.env

# Configure Client Environment
cp client/.env.example client/.env.local
```

---

### 3. Start Database and Backend

You can spin up PostgreSQL using Docker Compose, or run your own local PostgreSQL instance.

#### Option A: Using Docker Compose (Recommended)

```bash
cd server
docker compose up db -d
```

#### Option B: Standalone Setup

If running PostgreSQL locally:
1. Ensure PostgreSQL is running on port `5433` (or update `DATABASE_URL` in `server/.env`).
2. Run database migrations and generate the Prisma Client:

```bash
cd server
pnpm install
pnpm run db:migrate
pnpm run dev
```

The backend server will start on [http://localhost:4000](http://localhost:4000).  
Verify with: `curl http://localhost:4000/health` → `{"ok":true}`.

---

### 4. Start the Frontend Application

In a separate terminal:

```bash
cd client
pnpm install
pnpm dev
```

The Salenova web application will be live at [http://localhost:3000](http://localhost:3000).

---

## ⚡ Form Integration Examples

Integrating Salenova into any website takes less than 60 seconds.

### 1. Plain HTML Form

```html
<form action="http://localhost:4000/f/form_clx123abc" method="POST">
  <!-- Actual Fields -->
  <input type="text" name="name" placeholder="Your Name" required />
  <input type="email" name="email" placeholder="Your Email" required />
  <textarea name="message" placeholder="Project details..."></textarea>

  <!-- Invisible Honeypot Field (Catches spam bots) -->
  <input type="text" name="website" tabindex="-1" autocomplete="off" style="display:none;" />

  <button type="submit">Submit Request</button>
</form>
```

### 2. JavaScript / Next.js `fetch`

```typescript
const response = await fetch("http://localhost:4000/f/form_clx123abc", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Alex Doe",
    email: "alex@example.com",
    company: "Acme Corp",
    budget: "$5k-$10k",
  }),
});

const result = await response.json();
console.log(result); // { success: true, disposition: "accepted" }
```

### 3. cURL CLI Test

```bash
curl -X POST http://localhost:4000/f/form_clx123abc \
  -H "Content-Type: application/json" \
  -d '{"name":"Dev Tester","email":"test@salenova.com"}'
```

---

## 🛠️ Available Scripts

### Client (`/client`)

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts Next.js development server at port 3000 |
| `pnpm build` | Builds optimized production bundle |
| `pnpm start` | Starts Next.js production server |
| `pnpm lint` | Runs ESLint 9 code quality checks |

### Server (`/server`)

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Runs the API with `tsx watch` for auto-reloading |
| `pnpm start` | Runs the API in production mode |
| `pnpm db:generate` | Regenerates Prisma Client types |
| `pnpm db:migrate` | Applies development Prisma migrations |
| `pnpm db:deploy` | Applies migrations in staging/production |
| `pnpm db:studio` | Opens interactive Prisma Studio database GUI |

---

## 📚 Documentation Index

For detailed guides, please refer to the documents in the [`docs/`](./docs) folder:

- 🏛️ [**System Architecture & Security Model**](./docs/ARCHITECTURE.md)  
  *Detailed architecture breakdown, request lifecycle, data flow, and threat mitigations.*

- 📡 [**REST API Documentation**](./docs/API_DOCUMENTATION.md)  
  *Endpoints, request contracts, response payloads, status codes, and error schemas.*

- 🗄️ [**Database Schema & Prisma Models**](./docs/DATABASE_SCHEMA.md)  
  *Entity definitions, indexes, schema diagrams, and migration instructions.*

- 💻 [**Local Development Setup Guide**](./docs/LOCAL_SETUP.md)  
  *Troubleshooting, Docker orchestration, and step-by-step onboarding for contributors.*

- 🤝 [**Contributing Guidelines**](./docs/CONTRIBUTING.md)  
  *Branching strategy, Conventional Commits, code standards, and PR workflows.*

---

## 🗺️ Roadmap

- [x] Next.js 16 landing page with interactive 3D physics cards and code runner
- [x] Owner onboarding and signup interface
- [x] Docker Compose multi-container setup (PostgreSQL 16 + Express API)
- [x] Prisma ORM configuration with `Form` and `Submission` models
- [ ] Authentication API (JWT + secure HTTP-only cookies)
- [ ] Dynamic Form endpoint ingestion (`/f/:formId`) with honeypot verification
- [ ] Admin / Owner Dashboard (Submission review, disposition triage, CSV export)
- [ ] Webhook dispatchers (Slack, Discord, Zapier, Email alerts)
- [ ] Multi-tenant workspace management and team invites

---

## 🤝 Contributing

We welcome contributions of all kinds! Please review our [Contributing Guide](./docs/CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/my-new-feature`)
3. Commit your changes (`git commit -m 'feat: add my new feature'`)
4. Push to your branch (`git push origin feat/my-new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

# Local Development & Setup Guide

This guide walks you through setting up a complete Salenova development environment from scratch.

---

## 1. System Requirements

Ensure your machine meets the following prerequisites before getting started:

- **Node.js**: `v20.10.0` or higher (Node 22 LTS recommended)
- **Package Manager**: `pnpm` (`v9.x` or `v10.x`)
  ```bash
  corepack enable
  # or
  npm install -g pnpm
  ```
- **Docker & Docker Compose**: (Recommended for running PostgreSQL locally)
- **Git**: Latest version

---

## 2. Repository Setup

Clone the repository to your local directory:

```bash
git clone https://github.com/nitindogra7/crm.git
cd crm
```

---

## 3. Environment Variables Configuration

Salenova requires environment variables for both the backend and frontend.

### 3.1 Backend Configuration (`server/.env`)

Copy the example template:
```bash
cp server/.env.example server/.env
```

Ensure the contents look similar to:
```env
PORT=4000
FRONTEND_URL=http://localhost:3000

POSTGRES_USER=salenova
POSTGRES_PASSWORD=salenova_dev_pw
POSTGRES_DB=salenova

# Connection string for host machine to PostgreSQL container on port 5433
DATABASE_URL="postgresql://salenova:salenova_dev_pw@localhost:5433/salenova?schema=public"
```

### 3.2 Frontend Configuration (`client/.env.local`)

Copy the example template:
```bash
cp client/.env.example client/.env.local
```

Ensure the contents contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Starting the Database

We recommend using Docker Compose to launch PostgreSQL.

```bash
cd server
docker compose up db -d
```

> **Why port 5433?**  
> Notice that the `docker-compose.yml` maps port `5433:5432`. This avoids collisions if you already have a local PostgreSQL instance running on the default `5432` port.

To verify the container is healthy:
```bash
docker ps
```

You should see `salenova-db` with status `healthy`.

---

## 5. Backend Server Setup

From the `server/` directory:

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run Prisma database migrations:
   ```bash
   pnpm run db:migrate
   ```

3. Generate the Prisma Client types:
   ```bash
   pnpm run db:generate
   ```

4. Start the backend development server:
   ```bash
   pnpm run dev
   ```

The server will start at **http://localhost:4000**.  
Verify the health check in your browser or terminal:
```bash
curl http://localhost:4000/health
# Response: {"ok":true}
```

---

## 6. Frontend Web App Setup

Open a second terminal window and navigate to `client/`:

1. Install dependencies:
   ```bash
   cd client
   pnpm install
   ```

2. Start the Next.js development server:
   ```bash
   pnpm run dev
   ```

3. Open **http://localhost:3000** in your browser. You will see the Salenova landing page and interactive lead demo.
4. Navigate to **http://localhost:3000/signup** to preview the owner onboarding flow.

---

## 7. Troubleshooting Common Issues

### Issue 1: Database connection refused (`ECONNREFUSED 127.0.0.1:5433`)
- **Fix**: Check if the Docker container is running:
  ```bash
  docker compose ps
  ```
  If stopped, run `docker compose up db -d`.

### Issue 2: `@prisma/client did not initialize yet`
- **Fix**: Run `pnpm run db:generate` inside the `server/` directory.

### Issue 3: Port 4000 or 3000 already in use
- **Fix**: On Windows PowerShell, find and kill the process:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
  ```
  Or change `PORT=4001` in `server/.env` and `NEXT_PUBLIC_API_URL=http://localhost:4001` in `client/.env.local`.

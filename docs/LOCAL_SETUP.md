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
- **PostgreSQL**: Local PostgreSQL service (v14+) or cloud provider (Neon, Supabase, etc.)
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

# Connection string for your local or cloud PostgreSQL database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/salenova?schema=public"
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

Make sure your PostgreSQL server is running locally (e.g., via the PostgreSQL Windows service, macOS brew services, or Linux systemd) or obtain your connection URL from your cloud database provider (Supabase / Neon).

Create the database if it doesn't already exist:
```sql
CREATE DATABASE salenova;
```

Update your `DATABASE_URL` in `server/.env` to point to this database.

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

### Issue 1: Database connection refused (`ECONNREFUSED 127.0.0.1:5432`)
- **Fix**: Check if your PostgreSQL service is running and accessible on port 5432 (or your configured port). Verify that the credentials in `server/.env` match your PostgreSQL user and password.

### Issue 2: `@prisma/client did not initialize yet`
- **Fix**: Run `pnpm run db:generate` inside the `server/` directory.

### Issue 3: Port 4000 or 3000 already in use
- **Fix**: On Windows PowerShell, find and kill the process:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
  ```
  Or change `PORT=4001` in `server/.env` and `NEXT_PUBLIC_API_URL=http://localhost:4001` in `client/.env.local`.

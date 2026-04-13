# Security App

A full-stack GitHub security scanning workspace built with React, Express, Prisma, PostgreSQL, and Redis.

The application supports:
- GitHub OAuth authentication
- GitHub App installation and repository sync
- queued repository scans
- persisted scan reports and findings
- a portfolio-facing scan workspace flow

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Data: PostgreSQL, Prisma
- Queue: Redis, BullMQ
- Integrations: GitHub OAuth, GitHub App, ngrok

## Project Structure

```text
frontend/   React application
backend/    Express API, queue worker, Prisma schema
```

## Local Setup

### 1. Start infrastructure

From the project root:

```bash
cp .env.compose.example .env.compose
docker compose --env-file .env.compose up -d postgres redis
```

Optional, for GitHub callback/webhook development:

```bash
docker compose --env-file .env.compose --profile ngrok up -d ngrok
```

### 2. Start the backend

```bash
cd backend
npx prisma migrate deploy
npm run dev
```

The backend runs on `http://localhost:4000`.

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Notes

- PostgreSQL is exposed on `localhost:5433`
- Redis is exposed on `localhost:6379`
- The optional ngrok web UI is available on `http://localhost:4040`
- GitHub OAuth callback and GitHub App settings must match your active ngrok URL when testing integrations locally

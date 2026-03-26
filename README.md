# 🌊 Mekong Explorer

A community-driven travel discovery platform for the Mekong Delta (Vietnam).

## 🚀 Quick Start with Docker

The easiest way to get the entire stack (API + Frontend) running is using Docker Desktop.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Ensure your `.env` files are set up:
  - `api/.env` (pointing to your Supabase/Postgres DB)
  - `web/.env.local`

### 2. Run the App
From the root directory, run:
```bash
docker-compose up --build
```

- **Frontend:** http://localhost:3001
- **API:** http://localhost:3000/api/v1

### 3. Stop the App
```bash
docker-compose down
```

---

## 🛠 Project Structure (Monorepo)

- `api/`: NestJS backend.
- `web/`: Next.js frontend.
- `packages/types/`: Shared TypeScript types.
- `packages/ui/`: Shared UI components (if any).

## 📦 Manual Development

If you prefer running without Docker:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run API:**
   ```bash
   npm run start:dev -w api
   ```

3. **Run Web:**
   ```bash
   npm run dev -w web
   ```

## 🧩 Features
- Map-based discovery (Mapbox)
- Place details & categories
- Social Media & Video Review Integration (TikTok, YouTube, Facebook)
- User submissions & Admin moderation
- Community-driven reviews & photos
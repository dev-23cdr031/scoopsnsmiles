# Deployment Guide (Docker Compose)

This project is production-ready with 4 containers:

- `frontend` (Next.js)
- `backend` (Express API)
- `db` (MySQL 8)
- `ml-backend` (FastAPI Python service)

This guide includes:

- Local container deployment (ports 3000/5000/8000)
- Public host deployment with domains + HTTPS

## 1) Server prerequisites

Install these on your deployment machine (VPS/VM):

- Docker
- Docker Compose plugin (`docker compose`)

## 2) Configure production environment

From the project root:

1. Copy `.env.deploy.example` to `.env`.
2. Edit `.env` and set real values:
   - Strong MySQL passwords
   - `FRONTEND_ORIGIN` to your website domain
   - `NEXT_PUBLIC_API_BASE_URL` to your API public URL
    - Optional cloud DB settings:
       - `DATABASE_URL` (recommended for managed MySQL)
       - `DB_SSL=true` if your provider requires SSL
    - Optional cloud ML API:
       - `ML_API_BASE_URL` (if ML is hosted separately)

Important:

- `NEXT_PUBLIC_API_BASE_URL` is baked into the frontend build. If it changes, rebuild frontend (`docker compose up -d --build`).

## 3) Start deployment

Run from root:

```bash
docker compose up -d --build
```

Or with npm script:

```bash
npm run deploy:up
```

## 4) Verify services

Check container status:

```bash
docker compose ps
```

Check logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
docker compose logs -f ml-backend
```

Health checks:

- Backend health: `http://<server-ip>:5000/api/health`
- ML health: `http://<server-ip>:8000/api/health`
- Frontend: `http://<server-ip>:3000`

## 5) Stop or restart

Stop all:

```bash
docker compose down
```

Restart services:

```bash
docker compose restart
```

## 6) Updating after code changes

```bash
docker compose up -d --build
```

## 7) Domain and HTTPS (recommended)

For production, place Nginx/Caddy/Traefik in front:

- Route `https://bakery.example.com` -> `frontend:3000`
- Route `https://api.bakery.example.com` -> `backend:5000`
- Enable TLS certificates (Let's Encrypt)

Then set:

- `FRONTEND_ORIGIN=https://bakery.example.com`
- `NEXT_PUBLIC_API_BASE_URL=https://api.bakery.example.com`

## 8) Deploy on a public host (VPS) with real domains

This project includes `docker-compose.host.yml` and Caddy reverse proxy for automatic HTTPS.

### DNS setup

Create these DNS `A` records first:

- `bakery.example.com` -> your VPS public IP
- `api.bakery.example.com` -> your VPS public IP

### Server deployment

1. Clone/pull this repo on your VPS.
2. Copy `.env.host.example` to `.env.host`.
3. Edit `.env.host` with your real domain names and passwords.
4. Run:

```bash
docker compose --env-file .env.host -f docker-compose.host.yml up -d --build
```

Or use root scripts:

```bash
npm run deploy:host:up
```

### Verify

- App: `https://bakery.example.com`
- API health: `https://api.bakery.example.com/api/health`

### Logs and stop

```bash
npm run deploy:host:logs
npm run deploy:host:down
```

## Notes

- Database schema + seed data initializes automatically from `backend/scripts/seed.sql` on first DB startup.
- MySQL data is persisted in the `db_data` Docker volume.
- Existing local XAMPP setup is not required for Docker deployment.
- For cloud MySQL imports, create/select database first, then run `backend/scripts/seed.sql`.
- `backend` can use either split DB vars (`DB_HOST`, `DB_USER`, ...) or a single `DATABASE_URL`.

## 9) Deploy using Vercel

You can deploy this monorepo as 2 Vercel projects:

- Frontend project from `frontend/`
- Backend project from `backend/`

### 9.1 Backend on Vercel

1. In Vercel, create a new project and select this repository.
2. Set Root Directory to `backend`.
3. Keep default build settings (Node.js).
4. Add environment variables in Vercel project settings:
   - `DATABASE_URL` (recommended) or `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `DB_SSL=true` (if required by provider)
   - `ML_API_BASE_URL` (optional, deployed FastAPI URL)
   - `FRONTEND_ORIGIN` (set after frontend domain is known)
5. Deploy.

Backend uses `backend/vercel.json` and serves all routes through `backend/api/index.js`.

After deploy, note your backend URL, for example:

- `https://sakthi-bakers-backend.vercel.app`

Health check:

- `https://<backend-domain>/api/health`

### 9.2 Frontend on Vercel

1. Create another Vercel project from the same repository.
2. Set Root Directory to `frontend`.
3. Add environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=https://<backend-domain>`
4. Deploy frontend.

### 9.3 Final CORS update

After frontend deploy is ready, update backend Vercel env:

- `FRONTEND_ORIGIN=https://<frontend-domain>`

Redeploy backend once so CORS allows the frontend domain.

## 10) Cloud MySQL migration from XAMPP

1. Create a managed MySQL instance and database (name can stay `sakthi_bakers`).
2. Import `backend/scripts/seed.sql` into that selected database.
3. Update backend env:
   - Preferred: `DATABASE_URL=mysql://user:password@host:3306/sakthi_bakers`
   - Optional: `DB_SSL=true`
4. Redeploy backend.

## 11) ML backend standalone deploy (Render/Railway/VM)

If you deploy ML as a separate service (instead of compose), use root `ml-backend` with:

- Build: `pip install -r requirements.txt`
- Start: `python train_models.py && uvicorn main:app --host 0.0.0.0 --port $PORT`

Then set backend env:

- `ML_API_BASE_URL=https://<your-ml-domain>`

# Project Structure

## Frontend (`/frontend`)

- `frontend/app/`: Next.js App Router pages and layouts.
- `frontend/components/`: Reusable UI and feature components.
- `frontend/context/`: React context providers (cart state).
- `frontend/hooks/`: Shared custom hooks.
- `frontend/lib/api/client.ts`: Frontend HTTP client for backend APIs.
- `frontend/lib/types.ts`: Shared frontend TypeScript domain types.
- `frontend/public/`: Static assets.

## Backend (`/backend`)

- `backend/src/server.js`: API server bootstrap and middleware setup.
- `backend/src/routes/catalog.js`: Product/catalog read endpoints.
- `backend/src/routes/engagement.js`: Contact/newsletter/order tracking endpoints.
- `backend/src/data/store.js`: In-memory seed data and demo records.

## Legacy / Optional

- `ml-backend/`: Existing Python ML service files (kept separate from the web API backend).

## Run Commands

- Frontend: `pnpm dev:frontend`
- Backend: `pnpm dev:backend`

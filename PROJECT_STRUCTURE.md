# Project Structure

## Frontend (`/`)

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI and feature components.
- `context/`: React context providers (cart state).
- `hooks/`: Shared custom hooks.
- `lib/api/client.ts`: Frontend HTTP client for backend APIs.
- `lib/types.ts`: Shared frontend TypeScript domain types.
- `public/`: Static assets.

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

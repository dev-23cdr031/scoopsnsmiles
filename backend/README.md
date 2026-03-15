# Backend Service

This folder contains the corresponding backend for the bakery frontend.

## Structure

- `src/server.js`: Express server bootstrap.
- `src/routes/catalog.js`: Read-only catalog APIs (products, offers, team, etc.).
- `src/routes/engagement.js`: User actions (contact, newsletter, order tracking).
- `src/data/store.js`: In-memory data store and demo records.

## Run locally

1. `cd backend`
2. `pnpm install`
3. `pnpm dev`

The API runs on `http://localhost:5000` by default.

## API endpoints

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/testimonials?limit=3`
- `GET /api/team`
- `GET /api/offers`
- `GET /api/gift-cards`
- `GET /api/orders/:orderId`
- `POST /api/newsletter` with `{ "email": "name@example.com" }`
- `POST /api/contact` with `{ "name": "", "email": "", "subject": "", "message": "" }`

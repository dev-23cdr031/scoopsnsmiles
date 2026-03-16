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

## Kaggle dataset setup (admin ML analytics)

The admin insights endpoint trains from a Kaggle CSV when available.

1. Configure Kaggle CLI credentials (`KAGGLE_USERNAME`, `KAGGLE_KEY`).
2. Download a Kaggle dataset:
	 - PowerShell:
		 - `$env:KAGGLE_DATASET_REF="<owner>/<dataset>"`
		 - `pnpm download:kaggle`
3. Confirm CSV exists at `backend/data/kaggle_bakery_sales.csv`.

Optional custom path:

- `ADMIN_KAGGLE_DATASET_CSV=data/my_sales.csv`

If a valid Kaggle CSV is not found, the service uses synthetic fallback data.

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
- `GET /api/admin/ml/insights?days=7&limit=8&refresh=true`

# Rivningskartan

Shows threatened, demolished, and saved buildings in Sweden.

Built using [Next.js](https://nextjs.org/) with [Sanity](https://www.sanity.io/) as CMS.

## Development setup

- Install Node.js 18+
- Run `npm ci`
- Create a `.env.local` file by copying [`.env.example`](./.env.example) and filling in all variables (see below)
- Start the dev server with `npm run dev`
- By default: app at http://localhost:3000 · Studio at http://localhost:3000/studio

## Environment variables (Vercel / `.env.local`)

| Variable | Role |
|---------|------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (required at build/runtime) |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (e.g. `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version (see `.env.example`) |
| `NEXT_PUBLIC_MAPTILER_STYLE_URL` | MapLibre style URL for the map |
| `NEXT_PUBLIC_MIN_DEMOLITION_YEAR` | Minimum year shown on the submission form |
| `SANITY_AUTH_TOKEN` | Write-capable token for creating buildings (`/api/buildings`) |
| `SANITY_READ_TOKEN` | Used by `sanityFetch` when preview/draft reads need authenticated API |
| `GEOAPIFY_TOKEN` | Forward + reverse geocoding (`geocode` / `reverse`) |
| `LANGUAGE` | Active locale for dictionaries (`sv`, `en`, `nl`, …) |
| `SANITY_PREVIEW_SECRET` | Server: enables `/api/preview` when `?secret=` matches |
| `NEXT_PUBLIC_SANITY_PREVIEW_SECRET` | Same secret value exposed to Studio’s Preview iframe (`sanity/lib/preview.ts`); **must equal** `SANITY_PREVIEW_SECRET` |
| `SANITY_REVALIDATE_SECRET` | Webhook `/api/revalidate` signature verification (fallback if preview secret omitted) |
| `IMPORT_ADMIN_SECRET` | Dev-only `/api/import` and `/api/import-v2`; send header `x-import-secret` |

If Studio shows “Failed to fetch iframe URL” after enabling preview gate, verify both preview secrets match on deployment and redeploy after changing `.env.local`.

## Production setup

Deployed from the repo (e.g. Vercel). Configure secrets in the host’s environment-variable UI. Build is `npm run build`; run `npm test` locally before tagging releases.

### Web Analytics (Vercel Hobby)

The app includes [`@vercel/analytics`](https://www.npmjs.com/package/@vercel/analytics) with `<Analytics />` in the root layout (`src/app/layout.tsx`). After deployment:

1. In the Vercel dashboard open **your project → Analytics → Web Analytics**.
2. Click **Enable** so traffic is recorded.

No extra environment variables are required. Page views are collected **only on Vercel production deployments** (local `npm run dev` does not send analytics). If you publish a privacy notice, mention aggregate analytics in line with your legal guidance ([Vercel Web Analytics overview](https://vercel.com/docs/analytics)).

## Load testing (optional)

See [`load-tests/README.md`](./load-tests/README.md). Requires local [k6](https://k6.io/) and optionally Artillery (see devDependencies).

## Importing content

Bulk endpoints are **local development only** and require header `x-import-secret` (see [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)).

### Legacy CSV (`/api/import`)

Place images under `import-images/` when referenced from the CSV.

```sh
curl -X POST --data-binary @<path-to-csv> \
  -H "x-import-secret: YOUR_IMPORT_ADMIN_SECRET" \
  http://localhost:3000/api/import
```

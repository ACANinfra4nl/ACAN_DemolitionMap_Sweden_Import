# ACAN demolition maps

Maps of threatened, demolished, and saved buildings. The Netherlands (Sloopkaart) is the live deployment. Australia and Denmark share this codebase and are **not published yet**.

Built with [Next.js](https://nextjs.org/) and [Sanity](https://www.sanity.io/). One git branch (`kauter-dev`) serves every country. What differs is environment and config, not a fork.

## Development setup

- Install Node.js 18+
- Run `npm ci`
- Create a `.env.local` file by copying [`.env.example`](./.env.example) and filling in all variables (see below)
- Set `LANGUAGE` to `nl`, `au`, or `dk` and use that country’s Sanity project id and tokens
- Start the dev server with `npm run dev`
- By default: app at http://localhost:3000 · Studio at http://localhost:3000/studio

### Local compare (all three countries)

From this checkout:

```powershell
.\scripts\start-local-compare.ps1
```

| Site | URL | Map / list |
|------|-----|------------|
| Netherlands | http://localhost:3000 | `/kaart` `/lijst` |
| Australia | http://localhost:3001 | `/map` `/list` |
| Denmark | http://localhost:3002 | `/kort` `/liste` |
| Hub | http://localhost:3999/local-compare-hub.html | side-by-side |

Each process overrides `LANGUAGE` and `NEXT_PUBLIC_SANITY_PROJECT_ID` and uses its own `.next-nl` / `.next-au` / `.next-dk` folder. Shared secrets still come from `.env.local`. Write tokens must belong to the project you submit to.

## Environment variables (Vercel / `.env.local`)

| Variable | Role |
|---------|------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID. Known deployments: NL `q9jkymv5`, AU `yps8kvw9`, DK `obfbyt9x` (see `src/lib/countrySanity.ts`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (e.g. `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version (see `.env.example`) |
| `NEXT_PUBLIC_MAPTILER_STYLE_URL` | MapLibre style URL for the map |
| `NEXT_PUBLIC_MIN_DEMOLITION_YEAR` | Minimum year shown on the submission form |
| `SANITY_AUTH_TOKEN` | Write-capable token for creating buildings (`/api/buildings`) |
| `SANITY_READ_TOKEN` | Used by `sanityFetch` when preview/draft reads need authenticated API |
| `GEOAPIFY_TOKEN` | Forward + reverse geocoding (`geocode` / `reverse`) |
| `LANGUAGE` | Deployment locale (`nl`, `au`, `dk`, plus `sv` / `en` / …) |
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

## Country deployments

All maps run from **`kauter-dev`**. Country differences live in [`src/lib/countrySanity.ts`](./src/lib/countrySanity.ts) plus `LANGUAGE` and Sanity env. Historic branches `kauter-dev-AU` and `kauter-dev-DK` are archived (`archive/kauter-dev-AU`, `archive/kauter-dev-DK` tags) and must not receive new work.

Set `LANGUAGE` and `NEXT_PUBLIC_SANITY_PROJECT_ID` together. Dataset is `production` for all current maps. If the env project id is omitted, `LANGUAGE` selects the mapped project.

| Country | `LANGUAGE` | Sanity project ID | Live? |
|---------|------------|-------------------|-------|
| Netherlands | `nl` | `q9jkymv5` | yes |
| Australia | `au` | `yps8kvw9` | no — wait for the AU group |
| Denmark | `dk` | `obfbyt9x` | no — wait for the DK group |

Each country has its own Sanity project and Studio. `SANITY_AUTH_TOKEN` / `SANITY_READ_TOKEN` must belong to **that** project. Do not reuse the Netherlands token on AU or DK.

### How country behaviour is shared

| Shared in code | Per country |
|----------------|-------------|
| Map, list, form, overlay UI | Dictionary (`nl.json` / `au.json` / `dk.json`) |
| Pin-in-country check | Country outline in `src/data/countryPolygons.json` |
| Geocoding (Geoapify) | Forced `countrycode` filter for the active `LANGUAGE` |
| Feature flags | `overlayLayers`, `englishToggle` in `COUNTRY_DEPLOYMENTS` |
| Overlay pin click-through | Local URLs until AU/DK are live |

- New pins cannot be placed outside the home country. The add form does not open.
- Existing out-of-country records stay in Sanity but are hidden on the public map and list.
- Overlay layers are off by default. NL/DK can switch the UI to English (`EN` / local in the nav) without changing slugs, Sanity, or map bounds. AU is already English, so that toggle is off.
- AU/DK still use the generic ACAN mark until those groups supply logos.

List stored outliers (does not delete anything):

```sh
LANGUAGE=au NEXT_PUBLIC_SANITY_PROJECT_ID=yps8kvw9 node scripts/list-out-of-country-buildings.js
```

Known AU outliers (wrong geocode): Jolimont Street rows landed near Montevideo; 197 Bouverie Street has truncated coordinates (`37,48` instead of Melbourne). Fix in the AU Studio when ready.

### Git

- Long-lived branch: `kauter-dev`
- New work: short feature branches off `kauter-dev`, then merge back
- Hosting: one Vercel (or other) project per country, same git branch, different env
- Do not reopen `kauter-dev-AU` / `kauter-dev-DK` for features

### Later

- Publish AU and DK with those groups; then point overlay URLs at the live sites
- OpenFreeMap / Protomaps only after the basemap matches the current black-and-white satellite look (borders, roads, names). Extra underlays (building outlines, parcels) can be country-specific, optional, and opacity-toggled — do not build that until the base style is right
- IP-based language later; English toggle is enough for now
- Open source later (building data already lives in Sanity, not in git) 

## Importing content

Bulk endpoints are **local development only** and require header `x-import-secret` (see [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)).

### Legacy CSV (`/api/import`)

Place images under `import-images/` when referenced from the CSV.

```sh
curl -X POST --data-binary @<path-to-csv> \
  -H "x-import-secret: YOUR_IMPORT_ADMIN_SECRET" \
  http://localhost:3000/api/import
```

# Load / stress testing (pre–go-live)

Repeatable checks for **read paths**, **reverse geocode**, and **building submissions**. Run against **`npm run build && npm run start`** locally, a **Vercel preview URL**, or **staging** — not production Sanity datasets unless you intend to create real drafts.

## Prerequisites

| Tool | Purpose |
|------|---------|
| Node | `npm run load:artillery:buildings` (Artillery is a devDependency) |
| [k6](https://k6.io/docs/get-started/installation/) | `npm run load:k6:read`, `npm run load:k6:reverse` |

Set **`BASE_URL`** when not hitting localhost:

```bash
set BASE_URL=https://your-preview.vercel.app
# PowerShell:
$env:BASE_URL="https://your-preview.vercel.app"
```

## Route coverage

| Script | Target | Notes |
|--------|--------|--------|
| `load:k6:read` | `GET` home + map + list slugs | Set **`READ_PATHS`** if your `LANGUAGE` uses other URL segments (e.g. `READ_PATHS=/,/map,/list`). |
| `load:k6:reverse` | `GET /api/reverse?lat=&lng=` | Uses NL-ish coordinates; accepts **2xx or 404**. |
| `load:artillery:buildings` | `POST /api/buildings` | **Creates documents in Sanity**, multipart + images. Fixtures: `fixtures/building-*.jpg`. |

## API limits you must respect

- **`POST /api/buildings`**: **30 requests per 60 seconds per IP**. `artillery-buildings.yml` phases stay below that sustained rate; ramping higher will produce **429** by design.

## SLO thresholds (k6)

- Read routes: **p95 below 1200 ms**, **p99 below 2500 ms**, **errors below 1%**.
- Reverse geocode: **p95 below 800 ms**, **p99 below 2000 ms**, **errors below 2%**.

Tune thresholds in the respective `k6-*.js` files if your hosting tier differs.

## Commands

From repo root:

```bash
BASE_URL=http://localhost:3000 npm run load:k6:read
BASE_URL=http://localhost:3000 READ_PATHS=/,/map,/list npm run load:k6:read
BASE_URL=http://localhost:3000 READ_PATHS=/,/karta,/lista npm run load:k6:read
BASE_URL=http://localhost:3000 npm run load:k6:reverse
BASE_URL=http://localhost:3000 npm run load:artillery:buildings
```

Artillery **2.x** does not ship a `validate` command; load the YAML by running **`artillery run`** (see below). For a single-request smoke against multipart uploads, set **`BASE_URL`** as above, then:

```bash
npm run load:artillery:smoke
# equivalent: npx artillery run load-tests/artillery-buildings.yml --solo
```

Production-style server locally:

```bash
npm run build && npm run start
```

Then point **`BASE_URL=http://localhost:3000`** at that server.

## Before go-live checklist

1. **Read + reverse k6** green against preview/staging URL.
2. **Artillery buildings** green against **staging dataset** only (or accept cleanup of `Load Test Building` drafts in Studio).
3. Confirm **`SANITY_AUTH_TOKEN`** and Sanity project match the environment under test.
4. Optionally run **Vercel Analytics / logs** or **uptime checks** during the same window.

## Fixtures

JPEG placeholders live under **`load-tests/fixtures/`** (`building-1.jpg` … `building-3.jpg`). Replace with representative sizes/types if you need to stress larger uploads (watch API body limits in `src/app/api/buildings/route.ts`).

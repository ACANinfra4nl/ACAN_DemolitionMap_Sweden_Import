# Load Test Suite

This folder contains repeatable stress tests for the public app and APIs.

## Prerequisites

- Start the app (`npm run build && npm run start`) or use deployed URL.
- Set `BASE_URL` when testing remote environments.
- Install [k6](https://k6.io/docs/get-started/installation/) locally.
- For Artillery, dependencies are in `devDependencies`.

## SLO thresholds used in tests

- Read routes (`/`, `/kaart`, `/lijst`): p95 < 1200ms, p99 < 2500ms, error < 1%.
- Reverse geocode (`/api/reverse`): p95 < 800ms, p99 < 2000ms, error < 2%.

## Run tests

```bash
BASE_URL=https://www.sloopkaart.nl npm run load:k6:read
BASE_URL=https://www.sloopkaart.nl npm run load:k6:reverse
BASE_URL=https://www.sloopkaart.nl npm run load:artillery:buildings
```

## Artillery fixture note

`load-tests/artillery-buildings.yml` references image files under `load-tests/fixtures/`.
Add representative sample files before running image-upload scenarios:

- `load-tests/fixtures/building-1.jpg`
- `load-tests/fixtures/building-2.jpg`
- `load-tests/fixtures/building-3.jpg`

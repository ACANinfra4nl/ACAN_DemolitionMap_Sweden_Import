import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1200", "p(99)<2500"],
  },
  scenarios: {
    read_paths: {
      executor: "ramping-vus",
      startVUs: 5,
      stages: [
        { duration: "2m", target: 20 },
        { duration: "5m", target: 60 },
        { duration: "3m", target: 0 },
      ],
      gracefulRampDown: "30s",
    },
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

/** Comma-separated paths, e.g. `READ_PATHS=/,/map,/list` for English slugs. */
const READ_TARGETS = __ENV.READ_PATHS
  ? __ENV.READ_PATHS.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : ["/", "/kaart", "/lijst"];

export default function () {
  const path = READ_TARGETS[Math.floor(Math.random() * READ_TARGETS.length)];
  const response = http.get(`${BASE_URL}${path}`, {
    tags: { page: path },
    headers: {
      "x-load-test": "k6-read",
    },
  });
  check(response, {
    "read returns 2xx/3xx": (r) => r.status >= 200 && r.status < 400,
  });
  sleep(1);
}

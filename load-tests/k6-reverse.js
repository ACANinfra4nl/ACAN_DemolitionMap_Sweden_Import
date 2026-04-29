import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<800", "p(99)<2000"],
  },
  scenarios: {
    reverse_lookup: {
      executor: "constant-arrival-rate",
      rate: 20,
      timeUnit: "1s",
      duration: "5m",
      preAllocatedVUs: 20,
      maxVUs: 60,
    },
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

const NL_COORDS = [
  [51.9815, 4.3729],
  [51.9242, 4.4792],
  [52.0705, 4.3007],
  [52.3676, 4.9041],
  [51.4416, 5.4697],
];

export default function () {
  const [lat, lng] = NL_COORDS[Math.floor(Math.random() * NL_COORDS.length)];
  const response = http.get(`${BASE_URL}/api/reverse?lat=${lat}&lng=${lng}`, {
    tags: { route: "api-reverse" },
    headers: {
      "x-load-test": "k6-reverse",
    },
  });
  check(response, {
    "reverse returns 2xx/404": (r) =>
      (r.status >= 200 && r.status < 300) || r.status === 404,
  });
  sleep(0.2);
}

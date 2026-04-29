import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

type LogLevel = "info" | "warn" | "error";

export const getRequestId = (request: NextRequest): string =>
  request.headers.get("x-request-id")?.trim() || randomUUID();

export const withRequestId = (response: NextResponse, requestId: string) => {
  response.headers.set("x-request-id", requestId);
  return response;
};

export const logEvent = (
  level: LogLevel,
  event: string,
  payload: Record<string, unknown>,
) => {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    event,
    ...payload,
  });
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const memoryBuckets = new Map<string, RateLimitBucket>();

export const checkRateLimit = (
  key: string,
  maxRequests: number,
  windowMs: number,
) => {
  const now = Date.now();
  const previous = memoryBuckets.get(key);
  if (!previous || previous.resetAt <= now) {
    const current = { count: 1, resetAt: now + windowMs };
    memoryBuckets.set(key, current);
    return { allowed: true, remaining: maxRequests - 1, resetAt: current.resetAt };
  }
  previous.count += 1;
  memoryBuckets.set(key, previous);
  const remaining = Math.max(0, maxRequests - previous.count);
  return {
    allowed: previous.count <= maxRequests,
    remaining,
    resetAt: previous.resetAt,
  };
};

export const getClientIp = (request: NextRequest): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
};

export const boundedString = (
  value: FormDataEntryValue | null,
  maxLen: number,
): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > maxLen) return undefined;
  return trimmed;
};

export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (concurrency <= 1) {
    const out: R[] = [];
    for (let i = 0; i < items.length; i++) {
      out.push(await worker(items[i], i));
    }
    return out;
  }
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const poolSize = Math.min(concurrency, items.length);
  await Promise.all(
    Array.from({ length: poolSize }).map(async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await worker(items[index], index);
      }
    }),
  );
  return results;
}

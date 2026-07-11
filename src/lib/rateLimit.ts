// In-memory, per-process rate limiter. The target architecture uses Redis
// so limits hold across multiple server instances; for a single-instance
// MVP demo, an in-memory map is enough and needs no extra infra.

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

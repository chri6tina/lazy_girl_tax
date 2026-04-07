/**
 * Tiny in-memory rate limiter for serverless (best-effort per instance).
 * @param {Map<string, { count: number, reset: number }>} bucket
 */

export function rateLimitAllow(bucket, key, max, windowMs, now = Date.now()) {
  if (!key) return true;
  let b = bucket.get(key);
  if (!b || now > b.reset) {
    bucket.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= max) return false;
  b.count += 1;
  return true;
}

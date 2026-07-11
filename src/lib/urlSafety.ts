// Basic open-redirect / malware protection for the MVP.
// The target architecture calls for a maintained denylist + Google Safe
// Browsing lookups. Here we do the two cheap, high-value checks that catch
// the most common abuse patterns without an external dependency:
//   1. Only http/https schemes are shortenable (blocks javascript:, data:, file:, etc.)
//   2. A small denylist of known-bad hosts / patterns (illustrative, not exhaustive)

const BLOCKED_HOST_PATTERNS = [
  /(^|\.)example-phish\.test$/i,
  /(^|\.)malware-test\.test$/i,
];

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
];

export interface UrlCheckResult {
  ok: boolean;
  reason?: string;
  normalized?: string;
}

export function checkUrlSafety(rawUrl: string): UrlCheckResult {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { ok: false, reason: "That doesn't look like a valid URL." };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: "Only http and https links can be shortened." };
  }

  if (PRIVATE_HOST_PATTERNS.some((p) => p.test(url.hostname))) {
    return { ok: false, reason: "Links to local or private addresses aren't allowed." };
  }

  if (BLOCKED_HOST_PATTERNS.some((p) => p.test(url.hostname))) {
    return { ok: false, reason: "This destination is on our block list." };
  }

  if (rawUrl.length > 2048) {
    return { ok: false, reason: "That URL is too long." };
  }

  return { ok: true, normalized: url.toString() };
}

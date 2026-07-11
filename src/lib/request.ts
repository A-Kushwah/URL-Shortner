/** Very small user-agent sniff — good enough for a 3-bucket device breakdown. */
export function deviceFromUserAgent(ua: string | null): "mobile" | "tablet" | "desktop" {
  if (!ua) return "desktop";
  const s = ua.toLowerCase();
  if (/ipad|tablet/.test(s)) return "tablet";
  if (/mobi|iphone|android/.test(s)) return "mobile";
  return "desktop";
}

/**
 * Reads geo country from platform-provided headers when available
 * (e.g. Vercel sets x-vercel-ip-country in production). Falls back to
 * null for local development, where the dashboard shows "Unknown"
 * instead of guessing — see README for how this upgrades on deploy.
 */
export function countryFromHeaders(headers: Headers): string | null {
  return (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    null
  );
}

export function hostFromReferer(referer: string | null): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).host;
  } catch {
    return null;
  }
}

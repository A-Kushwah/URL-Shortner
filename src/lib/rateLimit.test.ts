import { describe, it, expect } from "vitest";
import { isRateLimited } from "./rateLimit";

describe("isRateLimited", () => {
  it("allows up to 20 requests per key and limits on the 21st request", () => {
    const key = `test-ip-${Date.now()}`;

    for (let i = 1; i <= 20; i++) {
      expect(isRateLimited(key)).toBe(false);
    }

    // 21st request should be rate limited
    expect(isRateLimited(key)).toBe(true);
  });

  it("tracks rate limits independently per key", () => {
    const keyA = `user-a-${Date.now()}`;
    const keyB = `user-b-${Date.now()}`;

    for (let i = 1; i <= 20; i++) {
      isRateLimited(keyA);
    }

    expect(isRateLimited(keyA)).toBe(true);
    expect(isRateLimited(keyB)).toBe(false);
  });
});

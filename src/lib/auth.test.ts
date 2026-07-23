import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, createSessionToken } from "./auth";
import jwt from "jsonwebtoken";

describe("auth helpers", () => {
  it("hashes password and verifies correctly", async () => {
    const raw = "SuperSecret123!";
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);
    expect(await verifyPassword(raw, hash)).toBe(true);
    expect(await verifyPassword("WrongPassword", hash)).toBe(false);
  });

  it("creates session JWT tokens with user sub payload", () => {
    const userId = "user-uuid-12345";
    const token = createSessionToken(userId);

    expect(typeof token).toBe("string");
    const decoded = jwt.decode(token) as { sub: string };
    expect(decoded.sub).toBe(userId);
  });
});

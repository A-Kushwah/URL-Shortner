import { describe, it, expect } from "vitest";
import { isReserved } from "./slug";

describe("slug utilities", () => {
  it("correctly identifies reserved system routes", () => {
    expect(isReserved("api")).toBe(true);
    expect(isReserved("login")).toBe(true);
    expect(isReserved("signup")).toBe(true);
    expect(isReserved("dashboard")).toBe(true);
    expect(isReserved("_next")).toBe(true);
  });

  it("returns false for non-reserved custom slugs", () => {
    expect(isReserved("my-custom-slug")).toBe(false);
    expect(isReserved("xyz123")).toBe(false);
    expect(isReserved("github")).toBe(false);
  });
});

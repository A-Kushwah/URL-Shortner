import { describe, it, expect } from "vitest";
import { checkUrlSafety } from "./urlSafety";

describe("checkUrlSafety", () => {
  it("allows valid http and https URLs", () => {
    const httpRes = checkUrlSafety("http://example.com/path?query=1");
    expect(httpRes.ok).toBe(true);
    expect(httpRes.normalized).toBe("http://example.com/path?query=1");

    const httpsRes = checkUrlSafety("https://google.com");
    expect(httpsRes.ok).toBe(true);
    expect(httpsRes.normalized).toBe("https://google.com/");
  });

  it("rejects invalid URLs", () => {
    const res = checkUrlSafety("not-a-valid-url");
    expect(res.ok).toBe(false);
    expect(res.reason).toContain("valid URL");
  });

  it("rejects non-http/https protocols", () => {
    const ftpRes = checkUrlSafety("ftp://example.com/file.txt");
    expect(ftpRes.ok).toBe(false);
    expect(ftpRes.reason).toContain("Only http and https");

    const jsRes = checkUrlSafety("javascript:alert(1)");
    expect(jsRes.ok).toBe(false);
    expect(jsRes.reason).toContain("Only http and https");

    const dataRes = checkUrlSafety("data:text/html,<h1>Hello</h1>");
    expect(dataRes.ok).toBe(false);
    expect(dataRes.reason).toContain("Only http and https");
  });

  it("blocks private and local host addresses", () => {
    const localhostRes = checkUrlSafety("http://localhost:3000/dashboard");
    expect(localhostRes.ok).toBe(false);
    expect(localhostRes.reason).toContain("local or private addresses");

    const ip127 = checkUrlSafety("http://127.0.0.1/admin");
    expect(ip127.ok).toBe(false);
    expect(ip127.reason).toContain("local or private addresses");

    const ip10 = checkUrlSafety("http://10.0.0.1/");
    expect(ip10.ok).toBe(false);
    expect(ip10.reason).toContain("local or private addresses");

    const ip192 = checkUrlSafety("http://192.168.1.1/router");
    expect(ip192.ok).toBe(false);
    expect(ip192.reason).toContain("local or private addresses");
  });

  it("blocks hosts on the denylist", () => {
    const phishRes = checkUrlSafety("https://example-phish.test/login");
    expect(phishRes.ok).toBe(false);
    expect(phishRes.reason).toContain("block list");

    const malwareRes = checkUrlSafety("https://sub.malware-test.test/download");
    expect(malwareRes.ok).toBe(false);
    expect(malwareRes.reason).toContain("block list");
  });

  it("rejects URLs longer than 2048 characters", () => {
    const longUrl = "https://example.com/" + "a".repeat(2050);
    const res = checkUrlSafety(longUrl);
    expect(res.ok).toBe(false);
    expect(res.reason).toContain("too long");
  });
});

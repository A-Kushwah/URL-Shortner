import { describe, it, expect } from "vitest";
import { createLink, getLinkById, getLinkBySlug, setLinkDisabled, recordClick, getTotalClicks } from "./links";
import { generateUniqueSlug } from "./slug";

describe("links data access layer", () => {
  it("creates and retrieves link by id and slug", () => {
    const slug = generateUniqueSlug();
    const destination = "https://example.com/dest-" + Date.now();
    const link = createLink(slug, destination, null);

    expect(link).toBeDefined();
    expect(link.slug).toBe(slug);
    expect(link.destination_url).toBe(destination);
    expect(link.disabled).toBe(0);

    const fetchedById = getLinkById(link.id);
    expect(fetchedById).toEqual(link);

    const fetchedBySlug = getLinkBySlug(slug);
    expect(fetchedBySlug).toEqual(link);
  });

  it("toggles link disabled status", () => {
    const slug = generateUniqueSlug();
    const link = createLink(slug, "https://example.com/toggle-test", null);

    setLinkDisabled(link.id, true);
    let updated = getLinkById(link.id);
    expect(updated?.disabled).toBe(1);

    setLinkDisabled(link.id, false);
    updated = getLinkById(link.id);
    expect(updated?.disabled).toBe(0);
  });

  it("records clicks and calculates total click counts", () => {
    const slug = generateUniqueSlug();
    const link = createLink(slug, "https://example.com/click-test", null);

    expect(getTotalClicks(link.id)).toBe(0);

    recordClick(link.id, "google.com", "US", "mobile");
    recordClick(link.id, "twitter.com", "CA", "desktop");

    expect(getTotalClicks(link.id)).toBe(2);
  });
});

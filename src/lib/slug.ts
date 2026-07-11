import { customAlphabet } from "nanoid";
import db from "./db";

// base62-ish alphabet, no ambiguous characters (0/O, 1/l/I) to keep short
// links easy to read aloud or retype.
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const generate = customAlphabet(alphabet, 7);

const RESERVED = new Set([
  "api", "login", "signup", "logout", "dashboard", "about", "privacy",
  "terms", "favicon.ico", "_next", "static",
]);

/** Generates a unique slug, retrying on the (extremely rare) collision. */
export function generateUniqueSlug(): string {
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = generate();
    if (RESERVED.has(slug)) continue;
    const existing = db.prepare("SELECT 1 FROM links WHERE slug = ?").get(slug);
    if (!existing) return slug;
  }
  throw new Error("Could not generate a unique slug, please try again.");
}

export function isReserved(slug: string) {
  return RESERVED.has(slug);
}

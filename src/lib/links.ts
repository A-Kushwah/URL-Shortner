import { randomUUID } from "crypto";
import db from "./db";
import type { Link, Click, LinkWithStats } from "./types";

export function createLink(slug: string, destinationUrl: string, ownerId: string | null): Link {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO links (id, slug, destination_url, owner_id) VALUES (?, ?, ?, ?)`
  ).run(id, slug, destinationUrl, ownerId);
  return getLinkById(id)!;
}

export function getLinkById(id: string): Link | undefined {
  return db.prepare("SELECT * FROM links WHERE id = ?").get(id) as Link | undefined;
}

export function getLinkBySlug(slug: string): Link | undefined {
  return db.prepare("SELECT * FROM links WHERE slug = ?").get(slug) as Link | undefined;
}

export function listLinksForOwner(ownerId: string): LinkWithStats[] {
  return db
    .prepare(
      `SELECT l.*, COUNT(c.id) as total_clicks
       FROM links l
       LEFT JOIN clicks c ON c.link_id = l.id
       WHERE l.owner_id = ?
       GROUP BY l.id
       ORDER BY l.created_at DESC`
    )
    .all(ownerId) as LinkWithStats[];
}

export function updateLinkDestination(id: string, destinationUrl: string) {
  db.prepare(
    `UPDATE links SET destination_url = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(destinationUrl, id);
}

export function setLinkDisabled(id: string, disabled: boolean) {
  db.prepare(
    `UPDATE links SET disabled = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(disabled ? 1 : 0, id);
}

export function recordClick(linkId: string, refererHost: string | null, country: string | null, device: string | null) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO clicks (id, link_id, referer_host, country, device) VALUES (?, ?, ?, ?, ?)`
  ).run(id, linkId, refererHost, country, device);
}

export function getTotalClicks(linkId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) as n FROM clicks WHERE link_id = ?")
    .get(linkId) as { n: number };
  return row.n;
}

export function getClicksByDay(linkId: string, days = 30): { day: string; clicks: number }[] {
  const rows = db
    .prepare(
      `SELECT substr(clicked_at, 1, 10) as day, COUNT(*) as clicks
       FROM clicks
       WHERE link_id = ? AND clicked_at >= datetime('now', ?)
       GROUP BY day
       ORDER BY day ASC`
    )
    .all(linkId, `-${days} days`) as { day: string; clicks: number }[];

  // Fill in zero-click days so the chart doesn't have gaps.
  const byDay = new Map(rows.map((r) => [r.day, r.clicks]));
  const result: { day: string; clicks: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ day: key, clicks: byDay.get(key) ?? 0 });
  }
  return result;
}

export function getTopReferrers(linkId: string, limit = 5): { referer_host: string; clicks: number }[] {
  return db
    .prepare(
      `SELECT COALESCE(referer_host, 'Direct / unknown') as referer_host, COUNT(*) as clicks
       FROM clicks WHERE link_id = ?
       GROUP BY referer_host ORDER BY clicks DESC LIMIT ?`
    )
    .all(linkId, limit) as { referer_host: string; clicks: number }[];
}

export function getTopCountries(linkId: string, limit = 5): { country: string; clicks: number }[] {
  return db
    .prepare(
      `SELECT COALESCE(country, 'Unknown') as country, COUNT(*) as clicks
       FROM clicks WHERE link_id = ?
       GROUP BY country ORDER BY clicks DESC LIMIT ?`
    )
    .all(linkId, limit) as { country: string; clicks: number }[];
}

export function getDeviceBreakdown(linkId: string): { device: string; clicks: number }[] {
  return db
    .prepare(
      `SELECT COALESCE(device, 'Unknown') as device, COUNT(*) as clicks
       FROM clicks WHERE link_id = ?
       GROUP BY device ORDER BY clicks DESC`
    )
    .all(linkId) as { device: string; clicks: number }[];
}

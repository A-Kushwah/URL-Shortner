import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import os from "os";

// This app uses a single SQLite file for storage. It keeps the setup small
// and avoids needing a separate database server for this version.

const isVercel = Boolean(process.env.VERCEL);
const dataDir = isVercel
  ? os.tmpdir()
  : path.join(process.cwd(), "data");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "app.db");

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

const db = global.__db ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") global.__db = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    destination_url TEXT NOT NULL,
    owner_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    disabled INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_links_owner ON links(owner_id);

  CREATE TABLE IF NOT EXISTS clicks (
    id TEXT PRIMARY KEY,
    link_id TEXT NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    clicked_at TEXT NOT NULL DEFAULT (datetime('now')),
    referer_host TEXT,
    country TEXT,
    device TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_clicks_link ON clicks(link_id);
  CREATE INDEX IF NOT EXISTS idx_clicks_time ON clicks(link_id, clicked_at);
`);

export default db;

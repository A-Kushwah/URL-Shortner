import { randomUUID } from "crypto";
import db from "./db";
import type { User } from "./types";

export function getUserByEmail(email: string): User | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as
    | User
    | undefined;
}

export function createUser(email: string, passwordHash: string): User {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)`
  ).run(id, email.toLowerCase(), passwordHash);
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User;
}

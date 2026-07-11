import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "./db";
import type { User } from "./types";

// Simplification vs. the target architecture's magic-link email auth: this
// MVP uses email + password with a JWT session cookie. No email provider
// required to run the demo locally. Swapping in magic links later only
// touches this file and the /login /signup routes.

const SESSION_COOKIE = "session";

function getJwtSecret() {
  const secret = process.env.SESSION_SECRET ?? "dev-session-secret-change-me";
  return secret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(userId: string) {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: "30d" });
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { sub: string };
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(payload.sub) as User | undefined;
    return user ?? null;
  } catch {
    return null;
  }
}

import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

/**
 * Lightweight custom auth for the single admin area.
 *
 * We deliberately avoid a heavyweight auth library: the app only needs one
 * email/password admin. A signed JWT stored in an httpOnly cookie is verified
 * in Edge middleware (no DB call) and in server components / route handlers.
 */

const COOKIE_NAME = "estate_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Session payload embedded in the JWT. */
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set — cannot sign/verify sessions.");
  }
  return new TextEncoder().encode(secret);
}

/** Sign a session token for the given user. */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

/**
 * Verify a raw token and return the session user, or null if invalid/expired.
 * Edge-safe (uses jose, no Node crypto) so middleware can call it too.
 */
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      email: (payload.email as string) ?? "",
      name: (payload.name as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

/** Validate credentials against the DB. Returns the session user or null. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { id: user.id, email: user.email, name: user.name };
}

/** Set the session cookie (called from a route handler after login). */
export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Clear the session cookie (logout). */
export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Read + verify the current session from cookies (server components/routes). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/** Throw-free guard helper: returns the session or null. */
export async function requireSession(): Promise<SessionUser | null> {
  return getSession();
}

export const SESSION_COOKIE = COOKIE_NAME;

import { NextResponse } from "next/server";
import {
  verifyCredentials,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";

/** POST /api/auth/login — validate credentials and set the session cookie. */
export async function POST(req: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 },
    );
  }

  const token = await createSessionToken(user);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}

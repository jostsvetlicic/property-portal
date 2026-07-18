/** Normalized agent fields ready for Prisma. */
export interface ParsedAgent {
  name: string;
  role: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  bio: string | null;
}

type Result = { ok: true; data: ParsedAgent } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates and normalizes an agent payload from the admin form. */
export function parseAgentInput(body: Record<string, unknown>): Result {
  const name = String(body.name ?? "").trim();
  if (!name) return { ok: false, error: "Name is required." };

  const role = String(body.role ?? "").trim();
  if (!role) return { ok: false, error: "Role is required." };

  const email = String(body.email ?? "").trim();
  if (!EMAIL_RE.test(email))
    return { ok: false, error: "A valid email is required." };

  const phone = String(body.phone ?? "").trim() || null;
  const photoUrl = String(body.photoUrl ?? "").trim() || null;
  const bio = String(body.bio ?? "").trim() || null;

  return { ok: true, data: { name, role, email, phone, photoUrl, bio } };
}

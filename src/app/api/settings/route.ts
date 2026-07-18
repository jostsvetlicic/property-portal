import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { agencyConfig } from "@config";

const MODES = ["portal", "boutique"] as const;
const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** PATCH /api/settings — update the single Settings row (admin only). */
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const mode = String(body.mode ?? "").trim();
  if (!MODES.includes(mode as (typeof MODES)[number]))
    return NextResponse.json({ error: "Invalid mode." }, { status: 400 });

  const name = String(body.name ?? "").trim();
  if (!name)
    return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const logoText = String(body.logoText ?? "").trim();
  if (!logoText)
    return NextResponse.json({ error: "Logo text is required." }, { status: 400 });

  const colors = [body.accentColor, body.baseColor, body.creamColor].map((c) =>
    String(c ?? "").trim(),
  );
  for (const c of colors) {
    if (c && !HEX_RE.test(c))
      return NextResponse.json(
        { error: `Invalid color value: ${c}` },
        { status: 400 },
      );
  }
  const [accentColor, baseColor, creamColor] = colors;

  const data = {
    mode,
    name,
    logoText,
    tagline: String(body.tagline ?? "").trim() || null,
    accentColor: accentColor || agencyConfig.theme.colors.accent,
    baseColor: baseColor || agencyConfig.theme.colors.base,
    creamColor: creamColor || agencyConfig.theme.colors.cream,
    email: String(body.email ?? "").trim() || null,
    phone: String(body.phone ?? "").trim() || null,
    address: String(body.address ?? "").trim() || null,
  };

  await prisma.settings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  // The theme + mode affect every page.
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}

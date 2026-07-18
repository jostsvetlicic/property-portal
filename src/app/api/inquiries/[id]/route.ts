import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES = ["new", "contacted", "closed"] as const;

/**
 * PATCH /api/inquiries/[id] — update a lead (admin only). Accepts any subset of
 * { read, status, agentId } so the same endpoint powers the read toggle, the
 * status control and agent assignment. An empty body defaults to marking read.
 */
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  let body: { read?: unknown; status?: unknown; agentId?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    // Empty body is allowed — default to marking as read.
  }

  const data: { read?: boolean; status?: string; agentId?: string | null } = {};

  if ("read" in body || Object.keys(body).length === 0) {
    data.read = body.read === undefined ? true : Boolean(body.read);
  }
  if ("status" in body) {
    const status = String(body.status);
    if (!STATUSES.includes(status as (typeof STATUSES)[number]))
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    data.status = status;
  }
  if ("agentId" in body) {
    data.agentId = body.agentId ? String(body.agentId) : null;
  }

  try {
    await prisma.inquiry.update({ where: { id }, data });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

/** DELETE /api/inquiries/[id] — delete a lead (admin only). */
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.inquiry.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

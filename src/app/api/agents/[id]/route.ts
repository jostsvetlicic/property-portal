import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseAgentInput } from "@/lib/agent-input";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/agents/[id] — update an agent (admin only). */
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.agent.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseAgentInput(body);
  if (!parsed.ok)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  await prisma.agent.update({ where: { id }, data: parsed.data });

  revalidatePath("/agents");
  return NextResponse.json({ ok: true });
}

/** DELETE /api/agents/[id] — delete an agent (properties keep, agent unset). */
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.agent.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Detach from properties first (relation is optional), then delete.
  await prisma.property.updateMany({
    where: { agentId: id },
    data: { agentId: null },
  });
  await prisma.agent.delete({ where: { id } });

  revalidatePath("/agents");
  return NextResponse.json({ ok: true });
}

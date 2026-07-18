import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseAgentInput } from "@/lib/agent-input";

/** POST /api/agents — create an agent (admin only). */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseAgentInput(body);
  if (!parsed.ok)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const agent = await prisma.agent.create({
    data: parsed.data,
    select: { id: true },
  });

  revalidatePath("/agents");
  return NextResponse.json(agent, { status: 201 });
}

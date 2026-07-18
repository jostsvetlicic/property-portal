import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

/**
 * PATCH /api/properties/[id]/featured — flip a property's featured flag (admin
 * only). A lightweight partial update so the properties list can toggle featured
 * without submitting the full property form.
 */
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  let body: { featured?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const featured = Boolean(body.featured);

  let updated;
  try {
    updated = await prisma.property.update({
      where: { id },
      data: { featured },
      select: { slug: true },
    });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/properties/${updated.slug}`);

  return NextResponse.json({ ok: true, featured });
}

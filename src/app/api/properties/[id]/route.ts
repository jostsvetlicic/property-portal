import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parsePropertyInput } from "@/lib/property-input";
import { deleteImage } from "@/lib/blob";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/properties/[id] — update a property (admin only). */
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.property.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parsePropertyInput(body);
  if (!parsed.ok)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { images, ...fields } = parsed.data;

  // Blob cleanup: delete images that were removed in the editor.
  const keepUrls = new Set(images.map((i) => i.url));
  const removed = existing.images.filter((i) => !keepUrls.has(i.url));

  // Replace the image set to reflect the submitted order/removals.
  const updated = await prisma.property.update({
    where: { id },
    data: {
      ...fields,
      images: {
        deleteMany: {},
        create: images,
      },
    },
    select: { id: true, slug: true },
  });

  await Promise.all(removed.map((i) => deleteImage(i.url)));

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/properties/${existing.slug}`);
  if (updated.slug !== existing.slug) {
    revalidatePath(`/properties/${updated.slug}`);
  }

  return NextResponse.json(updated);
}

/** DELETE /api/properties/[id] — delete a property (admin only). */
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.property.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.property.delete({ where: { id } });
  await Promise.all(existing.images.map((i) => deleteImage(i.url)));

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/properties/${existing.slug}`);

  return NextResponse.json({ ok: true });
}

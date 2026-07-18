import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parsePropertyInput } from "@/lib/property-input";
import { slugify } from "@/lib/format";

/** Generates a slug unique across properties (appends -2, -3… on collision). */
async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "property";
  let slug = base;
  let n = 2;
  while (await prisma.property.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

/**
 * Generates a public listing reference unique across properties, e.g.
 * "PP-472016". Retries on the (extremely unlikely) collision.
 */
async function uniqueReference(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const ref = `PP-${Math.floor(100000 + Math.random() * 900000)}`;
    if (!(await prisma.property.findUnique({ where: { reference: ref } }))) {
      return ref;
    }
  }
  // Fallback guaranteed to be unique enough for a demo dataset.
  return `PP-${Date.now().toString().slice(-6)}`;
}

/** POST /api/properties — create a property (admin only). */
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

  const parsed = parsePropertyInput(body);
  if (!parsed.ok)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { images, ...fields } = parsed.data;
  const slug = await uniqueSlug(fields.title);
  const reference = await uniqueReference();

  const property = await prisma.property.create({
    data: {
      ...fields,
      slug,
      reference,
      images: { create: images },
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/");
  revalidatePath("/listings");

  return NextResponse.json(property, { status: 201 });
}

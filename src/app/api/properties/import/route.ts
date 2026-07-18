import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseCsv } from "@/lib/csv";
import {
  IMPORT_COLUMNS,
  csvRowToPropertyBody,
  isTemplateExampleRow,
} from "@/lib/property-csv";
import { parsePropertyInput } from "@/lib/property-input";
import { slugify } from "@/lib/format";

interface RowError {
  row: number; // 1-based data row number (excludes the header)
  message: string;
}

/** Reserves a slug unique against the DB *and* the batch being imported. */
function makeUniqueSlug(title: string, taken: Set<string>): string {
  const base = slugify(title) || "property";
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  taken.add(slug);
  return slug;
}

/**
 * Generates a public listing reference (e.g. "PP-472016") unique against the DB
 * *and* the batch being imported. Retries on the unlikely collision.
 */
async function makeUniqueReference(taken: Set<string>): Promise<string> {
  for (let attempt = 0; attempt < 25; attempt++) {
    const ref = `PP-${Math.floor(100000 + Math.random() * 900000)}`;
    if (taken.has(ref)) continue;
    if (!(await prisma.property.findUnique({ where: { reference: ref } }))) {
      taken.add(ref);
      return ref;
    }
  }
  const ref = `PP-${Date.now().toString().slice(-6)}`;
  taken.add(ref);
  return ref;
}

/**
 * POST /api/properties/import — bulk-create listings from CSV text (admin only).
 * Validates each row with the same parser the single-property form uses; a bad
 * row is reported and skipped, good rows are still imported.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  let body: { csv?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const csv = typeof body.csv === "string" ? body.csv : "";
  if (!csv.trim())
    return NextResponse.json({ error: "No CSV content." }, { status: 400 });

  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0)
    return NextResponse.json(
      { error: "The file has no data rows." },
      { status: 400 },
    );

  // Require the mandatory columns to be present in the header.
  const required = IMPORT_COLUMNS.filter((c) => c.required).map((c) => c.key);
  const missing = required.filter((k) => !headers.includes(k));
  if (missing.length > 0)
    return NextResponse.json(
      { error: `Missing required column(s): ${missing.join(", ")}.` },
      { status: 400 },
    );

  // Resolve agent emails once for the whole batch.
  const agents = await prisma.agent.findMany({
    select: { id: true, email: true },
  });
  const agentsByEmail = new Map(
    agents.map((a) => [a.email.trim().toLowerCase(), a.id]),
  );

  // Pre-load existing slugs + references so batch values are globally unique.
  const existing = await prisma.property.findMany({
    select: { slug: true, reference: true },
  });
  const taken = new Set(existing.map((p) => p.slug));
  const refsTaken = new Set(existing.map((p) => p.reference));

  const errors: RowError[] = [];
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const rowNo = i + 1;
    const row = rows[i];

    if (isTemplateExampleRow(row)) {
      skipped++;
      continue;
    }

    const parsed = parsePropertyInput(csvRowToPropertyBody(row, agentsByEmail));
    if (!parsed.ok) {
      errors.push({ row: rowNo, message: parsed.error });
      continue;
    }

    // If an agentEmail was supplied but didn't match, flag it rather than
    // silently importing an unassigned listing.
    const agentEmail = (row.agentEmail ?? "").trim();
    if (agentEmail && !parsed.data.agentId) {
      errors.push({
        row: rowNo,
        message: `Unknown agent email "${agentEmail}".`,
      });
      continue;
    }

    const { images, ...fields } = parsed.data;
    const slug = makeUniqueSlug(fields.title, taken);
    const reference = await makeUniqueReference(refsTaken);

    try {
      await prisma.property.create({
        data: { ...fields, slug, reference, images: { create: images } },
      });
      created++;
    } catch {
      errors.push({ row: rowNo, message: "Database error while saving." });
    }
  }

  if (created > 0) {
    revalidatePath("/");
    revalidatePath("/listings");
  }

  return NextResponse.json({
    created,
    skipped,
    failed: errors.length,
    total: rows.length,
    errors,
  });
}

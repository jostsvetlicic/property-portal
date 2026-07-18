import { PROPERTY_TYPES, PROPERTY_STATUSES } from "@/types";
import { toCsv } from "@/lib/csv";

/**
 * Single source of truth for the property CSV schema. The downloadable
 * template, the client-side preview and the server import route all derive
 * their columns from this list, so they never drift apart.
 *
 * Multi-value cells (features, images) use `;` as an inner separator so they
 * don't collide with the CSV comma delimiter.
 */
export interface ImportColumn {
  key: string;
  required?: boolean;
  hint: string;
  example: string;
}

export const IMPORT_COLUMNS: ImportColumn[] = [
  { key: "title", required: true, hint: "Listing name", example: "Villa Aurelia" },
  { key: "price", required: true, hint: "Whole euros, no symbols", example: "6950000" },
  { key: "location", required: true, hint: "City, Country", example: "Dubrovnik, Croatia" },
  {
    key: "type",
    required: true,
    hint: `One of: ${PROPERTY_TYPES.join(" | ")}`,
    example: "Villa",
  },
  {
    key: "status",
    hint: `One of: ${PROPERTY_STATUSES.join(" | ")} (default available)`,
    example: "available",
  },
  { key: "bedrooms", hint: "Whole number", example: "5" },
  { key: "bathrooms", hint: "Whole number", example: "6" },
  { key: "area", hint: "Interior m²", example: "620" },
  {
    key: "description",
    required: true,
    hint: "Main descriptive copy",
    example: "A rare beachfront villa with panoramic Adriatic views.",
  },
  {
    key: "narrative",
    hint: "Boutique-mode story text (optional)",
    example: "Wake to the sound of the sea…",
  },
  {
    key: "features",
    hint: "Semicolon-separated",
    example: "Infinity pool; Sea view; Private mooring",
  },
  { key: "featured", hint: "true / false", example: "true" },
  { key: "lat", hint: "Map latitude (optional)", example: "42.6407" },
  { key: "lng", hint: "Map longitude (optional)", example: "18.1077" },
  {
    key: "videoUrl",
    hint: "Virtual tour URL (optional)",
    example: "https://www.youtube.com/watch?v=abc123",
  },
  {
    key: "images",
    hint: "Semicolon-separated image URLs",
    example: "https://example.com/1.jpg; https://example.com/2.jpg",
  },
  {
    key: "agentEmail",
    hint: "Assigns to an existing agent by email (optional)",
    example: "elena@adriaticestates.com",
  },
  {
    key: "metaTitle",
    hint: "SEO title override (optional)",
    example: "Villa Aurelia — Beachfront Villa in Dubrovnik",
  },
  {
    key: "metaDescription",
    hint: "SEO description override (optional)",
    example: "A rare beachfront villa with infinity pool and private mooring.",
  },
];

const COLUMN_KEYS = IMPORT_COLUMNS.map((c) => c.key);

/**
 * Builds the downloadable template: a header row plus one example row. Per-
 * column guidance lives in the importer UI (a reference table) rather than in
 * the file, so the CSV stays clean and every data row is real.
 */
export function buildTemplateCsv(): string {
  const header = COLUMN_KEYS;
  const example = IMPORT_COLUMNS.map((c) => c.example);
  return toCsv([header, example]);
}

function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

const TRUTHY = new Set(["true", "1", "yes", "y", "x"]);

/**
 * Maps one parsed CSV row to a body accepted by `parsePropertyInput`. Agent
 * lookup is resolved via a caller-supplied email→id map (server-side only).
 * The second and third template rows (hint + example) are skippable by the
 * caller; this function itself just maps whatever it is given.
 */
export function csvRowToPropertyBody(
  row: Record<string, string>,
  agentsByEmail: Map<string, string>,
): Record<string, unknown> {
  const agentEmail = (row.agentEmail ?? "").trim().toLowerCase();
  const agentId = agentEmail ? (agentsByEmail.get(agentEmail) ?? "") : "";

  return {
    title: row.title,
    price: row.price,
    location: row.location,
    type: row.type,
    status: row.status || "available",
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    description: row.description,
    narrative: row.narrative,
    videoUrl: row.videoUrl,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    features: splitList(row.features),
    featured: TRUTHY.has((row.featured ?? "").trim().toLowerCase()),
    lat: row.lat,
    lng: row.lng,
    agentId,
    images: splitList(row.images).map((url) => ({ url })),
  };
}

/**
 * True only when a row is byte-identical to the template's example row across
 * every column, so re-importing an untouched template doesn't create a junk
 * listing. Real data (even a genuine "Villa Aurelia") won't match all columns.
 */
export function isTemplateExampleRow(row: Record<string, string>): boolean {
  return IMPORT_COLUMNS.every(
    (c) => (row[c.key] ?? "").trim() === c.example.trim(),
  );
}

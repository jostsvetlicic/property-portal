import {
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  LISTING_TYPES,
  CONDITIONS,
  ENERGY_RATINGS,
} from "@/types";

/** Normalized property fields ready for Prisma (features JSON-encoded). */
export interface ParsedProperty {
  title: string;
  price: number;
  currency: string;
  listingType: string;
  location: string;
  lat: number | null;
  lng: number | null;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  landSize: number | null;
  yearBuilt: number | null;
  floor: number | null;
  totalFloors: number | null;
  condition: string | null;
  energyRating: string | null;
  parking: boolean;
  elevator: boolean;
  balcony: boolean;
  description: string;
  narrative: string | null;
  videoUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  features: string; // JSON string
  featured: boolean;
  agentId: string | null;
  images: { url: string; alt: string | null; order: number }[];
}

type Result =
  | { ok: true; data: ParsedProperty }
  | { ok: false; error: string };

function num(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Validates and normalizes a property payload from the admin form. */
export function parsePropertyInput(body: Record<string, unknown>): Result {
  const title = String(body.title ?? "").trim();
  if (!title) return { ok: false, error: "Title is required." };

  const location = String(body.location ?? "").trim();
  if (!location) return { ok: false, error: "Location is required." };

  const price = num(body.price);
  if (price === null || price < 0)
    return { ok: false, error: "A valid price is required." };

  const type = String(body.type ?? "").trim();
  if (!PROPERTY_TYPES.includes(type as (typeof PROPERTY_TYPES)[number]))
    return { ok: false, error: "Invalid property type." };

  const listingType = String(body.listingType ?? "sale").trim();
  if (!LISTING_TYPES.includes(listingType as (typeof LISTING_TYPES)[number]))
    return { ok: false, error: "Invalid listing type." };

  const status = String(body.status ?? "available").trim();
  if (!PROPERTY_STATUSES.includes(status as (typeof PROPERTY_STATUSES)[number]))
    return { ok: false, error: "Invalid status." };

  const bedrooms = num(body.bedrooms) ?? 0;
  const bathrooms = num(body.bathrooms) ?? 0;
  const area = num(body.area) ?? 0;
  const landSize = num(body.landSize);
  const yearBuilt = num(body.yearBuilt);
  const floor = num(body.floor);
  const totalFloors = num(body.totalFloors);

  const conditionRaw = String(body.condition ?? "").trim();
  const condition =
    conditionRaw &&
    CONDITIONS.includes(conditionRaw as (typeof CONDITIONS)[number])
      ? conditionRaw
      : null;

  const energyRaw = String(body.energyRating ?? "").trim().toUpperCase();
  const energyRating =
    energyRaw &&
    ENERGY_RATINGS.includes(energyRaw as (typeof ENERGY_RATINGS)[number])
      ? energyRaw
      : null;

  const description = String(body.description ?? "").trim();
  if (!description) return { ok: false, error: "Description is required." };

  const narrativeRaw = String(body.narrative ?? "").trim();
  const narrative = narrativeRaw || null;

  const videoUrl = String(body.videoUrl ?? "").trim() || null;

  const metaTitle = String(body.metaTitle ?? "").trim() || null;
  const metaDescription = String(body.metaDescription ?? "").trim() || null;

  const featuresArr = Array.isArray(body.features)
    ? (body.features as unknown[])
        .map((f) => String(f).trim())
        .filter(Boolean)
    : [];

  const imagesArr = Array.isArray(body.images)
    ? (body.images as unknown[])
        .map((img, i) => {
          const o = img as Record<string, unknown>;
          const url = String(o?.url ?? "").trim();
          if (!url) return null;
          return {
            url,
            alt: o?.alt ? String(o.alt).trim() : null,
            order: i,
          };
        })
        .filter((x): x is { url: string; alt: string | null; order: number } =>
          Boolean(x),
        )
    : [];

  const agentIdRaw = String(body.agentId ?? "").trim();

  return {
    ok: true,
    data: {
      title,
      price: Math.round(price),
      currency: String(body.currency ?? "EUR").trim() || "EUR",
      listingType,
      location,
      lat: num(body.lat),
      lng: num(body.lng),
      type,
      status,
      bedrooms: Math.max(0, Math.round(bedrooms)),
      bathrooms: Math.max(0, Math.round(bathrooms)),
      area: Math.max(0, Math.round(area)),
      landSize: landSize != null ? Math.max(0, Math.round(landSize)) : null,
      yearBuilt: yearBuilt != null ? Math.round(yearBuilt) : null,
      floor: floor != null ? Math.round(floor) : null,
      totalFloors: totalFloors != null ? Math.round(totalFloors) : null,
      condition,
      energyRating,
      parking: Boolean(body.parking),
      elevator: Boolean(body.elevator),
      balcony: Boolean(body.balcony),
      description,
      narrative,
      videoUrl,
      metaTitle,
      metaDescription,
      features: JSON.stringify(featuresArr),
      featured: Boolean(body.featured),
      agentId: agentIdRaw || null,
      images: imagesArr,
    },
  };
}

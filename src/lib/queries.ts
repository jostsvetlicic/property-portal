import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Shared data-access helpers for properties and agents.
 *
 * These are used by BOTH portal and boutique front-ends — the backend is shared
 * across modes. Presentation differs; data does not.
 */

/** Filters accepted by the listings page (parsed from URL search params). */
export interface PropertyFilters {
  listingType?: string; // sale | rent
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "size" | "price_per_m2";
}

const propertyInclude = {
  images: { orderBy: { order: "asc" } },
  agent: true,
} satisfies Prisma.PropertyInclude;

export type PropertyWithRelations = Prisma.PropertyGetPayload<{
  include: typeof propertyInclude;
}>;

/** Builds a Prisma `where` clause from URL-derived filters. */
export function buildWhere(filters: PropertyFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};

  if (filters.listingType) {
    where.listingType = filters.listingType;
  }
  if (filters.location) {
    where.location = { contains: filters.location };
  }
  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.bedrooms) {
    where.bedrooms = { gte: filters.bedrooms };
  }
  if (filters.bathrooms) {
    where.bathrooms = { gte: filters.bathrooms };
  }
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }

  return where;
}

function buildOrderBy(
  sort?: PropertyFilters["sort"],
): Prisma.PropertyOrderByWithRelationInput[] {
  // Featured listings are always pinned to the top, then the chosen sort applies.
  switch (sort) {
    case "price_asc":
      return [{ featured: "desc" }, { price: "asc" }];
    case "price_desc":
      return [{ featured: "desc" }, { price: "desc" }];
    case "size":
      return [{ featured: "desc" }, { area: "desc" }];
    default:
      // "newest" (and "price_per_m2", which is refined client-side).
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

/** Returns properties matching the given filters, newest first by default. */
export async function getProperties(
  filters: PropertyFilters = {},
): Promise<PropertyWithRelations[]> {
  try {
    return await prisma.property.findMany({
      where: buildWhere(filters),
      include: propertyInclude,
      orderBy: buildOrderBy(filters.sort),
    });
  } catch {
    return [];
  }
}

/** Returns featured properties (falls back to newest if none flagged). */
export async function getFeaturedProperties(
  limit = 6,
): Promise<PropertyWithRelations[]> {
  try {
    const featured = await prisma.property.findMany({
      where: { featured: true },
      include: propertyInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    if (featured.length > 0) return featured;

    return prisma.property.findMany({
      include: propertyInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

/** Single property by slug (public detail page). */
export async function getPropertyBySlug(
  slug: string,
): Promise<PropertyWithRelations | null> {
  try {
    return await prisma.property.findUnique({
      where: { slug },
      include: propertyInclude,
    });
  } catch {
    return null;
  }
}

/**
 * Related listings for the "Similar properties" row on the detail page.
 */
export async function getSimilarProperties(
  property: Pick<PropertyWithRelations, "id" | "type" | "location">,
  limit = 3,
): Promise<PropertyWithRelations[]> {
  try {
    const country = property.location.split(",").pop()?.trim();

    const picked: PropertyWithRelations[] = [];
    const seen = new Set<string>([property.id]);

    const add = (rows: PropertyWithRelations[]) => {
      for (const r of rows) {
        if (picked.length >= limit) break;
        if (seen.has(r.id)) continue;
        seen.add(r.id);
        picked.push(r);
      }
    };

    add(
      await prisma.property.findMany({
        where: { type: property.type, id: { not: property.id } },
        include: propertyInclude,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    );

    if (picked.length < limit && country) {
      add(
        await prisma.property.findMany({
          where: {
            location: { contains: country },
            id: { notIn: [...seen] },
          },
          include: propertyInclude,
          orderBy: { createdAt: "desc" },
          take: limit,
        }),
      );
    }

    if (picked.length < limit) {
      add(
        await prisma.property.findMany({
          where: { id: { notIn: [...seen] } },
          include: propertyInclude,
          orderBy: { createdAt: "desc" },
          take: limit,
        }),
      );
    }

    return picked.slice(0, limit);
  } catch {
    return [];
  }
}

/** Single property by id (admin edit). */
export async function getPropertyById(
  id: string,
): Promise<PropertyWithRelations | null> {
  try {
    return await prisma.property.findUnique({
      where: { id },
      include: propertyInclude,
    });
  } catch {
    return null;
  }
}

/** Distinct locations for filter dropdowns. */
export async function getLocations(): Promise<string[]> {
  try {
    const rows = await prisma.property.findMany({
      select: { location: true },
      distinct: ["location"],
      orderBy: { location: "asc" },
    });
    return rows.map((r) => r.location);
  } catch {
    return [];
  }
}

/** All agents (public agents page + admin). */
export async function getAgents() {
  try {
    return await prisma.agent.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    return [];
  }
}

export async function getAgentById(id: string) {
  try {
    return await prisma.agent.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

/** Lightweight totals for the brand/trust strip. */
export async function getStats() {
  try {
    const [count, agg] = await Promise.all([
      prisma.property.count(),
      prisma.property.aggregate({ _sum: { price: true } }),
    ]);
    return {
      propertyCount: count,
      totalValue: agg._sum.price ?? 0,
    };
  } catch {
    return { propertyCount: 0, totalValue: 0 };
  }
}

"use client";

import { useEffect, useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { getRecentlyViewed } from "@/lib/saved-searches";
import type { PropertyWithRelations } from "@/lib/queries";

/**
 * "Recently viewed" row. Viewed slugs live in localStorage, so the server hands
 * over the full (small) property set and this client component filters + orders
 * it by the visitor's history. Renders nothing until it finds matches, so it
 * never flashes an empty section on a first visit.
 */
export function RecentlyViewed({
  properties,
  title,
  subtitle,
  featuredLabel,
  newLabel,
}: {
  properties: PropertyWithRelations[];
  title: string;
  subtitle: string;
  featuredLabel: string;
  newLabel: string;
}) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getRecentlyViewed());
  }, []);

  const bySlug = new Map(properties.map((p) => [p.slug, p]));
  const items = slugs
    .map((s) => bySlug.get(s))
    .filter((p): p is PropertyWithRelations => Boolean(p))
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-[100rem] px-6 sm:px-8 lg:px-12">
        <div className="mb-8">
          <p className="eyebrow text-accent">{title}</p>
          <p className="mt-2 text-cream/55">{subtitle}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              featuredLabel={featuredLabel}
              newLabel={newLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

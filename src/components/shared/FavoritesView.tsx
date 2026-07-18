"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Heart, ArrowRight } from "lucide-react";
import { Container } from "./Container";
import { PropertyCard } from "./PropertyCard";
import { useSaved } from "./SavedProvider";
import type { PropertyWithRelations } from "@/lib/queries";

/**
 * Favorites page body. The server passes every property; we filter to the
 * hearted ids held in the client store (localStorage), preserving save order.
 * Works identically in both modes — a clean saved grid.
 */
export function FavoritesView({
  properties,
  featuredLabel,
}: {
  properties: PropertyWithRelations[];
  featuredLabel: string;
}) {
  const { labels, hydrated, favorites } = useSaved();

  const saved = useMemo(() => {
    const byId = new Map(properties.map((p) => [p.id, p]));
    return favorites
      .map((id) => byId.get(id))
      .filter((p): p is PropertyWithRelations => Boolean(p));
  }, [properties, favorites]);

  return (
    <div className="pt-28 pb-28">
      <Container>
        <header className="mb-14">
          <p className="eyebrow text-accent">{labels.favoritesEyebrow}</p>
          <h1 className="mt-3 flex items-center gap-4 font-display text-4xl text-cream sm:text-5xl">
            {labels.favoritesTitle}
            {hydrated && saved.length > 0 && (
              <span className="grid h-9 min-w-9 place-items-center rounded-full bg-accent px-2.5 font-sans text-lg font-medium text-base">
                {saved.length}
              </span>
            )}
          </h1>
          <div className="rule mt-8" />
        </header>

        {/* Before hydration we don't know the saved set — render nothing to
            avoid flashing the empty state on a page that actually has saves. */}
        {!hydrated ? (
          <div className="min-h-[40vh]" />
        ) : saved.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-charcoal ring-1 ring-cream/10">
              <Heart className="h-7 w-7 text-accent" />
            </div>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/60">
              {labels.favoritesEmpty}
            </p>
            <Link
              href="/listings"
              className="btn-glow mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium tracking-wide text-base transition-colors hover:bg-accent-soft"
            >
              {labels.favoritesEmptyCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p) => (
              <PropertyCard key={p.id} property={p} featuredLabel={featuredLabel} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

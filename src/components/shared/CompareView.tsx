"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Scale, X, ArrowRight, Check } from "lucide-react";
import { Container } from "./Container";
import { useSaved } from "./SavedProvider";
import { formatPrice, formatArea, parseFeatures } from "@/lib/format";
import type { PropertyWithRelations } from "@/lib/queries";

/**
 * Side-by-side comparison of the 2–3 selected properties. Server passes the full
 * property set; we filter to the compared ids (client store) and lay them out in
 * a scrollable comparison grid: a sticky label column + one column per property.
 */
export function CompareView({
  properties,
}: {
  properties: PropertyWithRelations[];
}) {
  const { labels, hydrated, compare, removeCompare } = useSaved();

  const selected = useMemo(() => {
    const byId = new Map(properties.map((p) => [p.id, p]));
    return compare
      .map((id) => byId.get(id))
      .filter((p): p is PropertyWithRelations => Boolean(p));
  }, [properties, compare]);

  const rows: { label: string; render: (p: PropertyWithRelations) => React.ReactNode }[] = [
    { label: labels.colPrice, render: (p) => (
      <span className="font-display text-xl text-accent">
        {formatPrice(p.price, p.currency)}
      </span>
    ) },
    { label: labels.colLocation, render: (p) => p.location },
    { label: labels.colType, render: (p) => p.type },
    { label: labels.colBeds, render: (p) => p.bedrooms },
    { label: labels.colBaths, render: (p) => p.bathrooms },
    { label: labels.colArea, render: (p) => formatArea(p.area) },
    { label: labels.colFeatures, render: (p) => {
      const features = parseFeatures(p.features);
      if (features.length === 0) return <span className="text-cream/30">—</span>;
      return (
        <ul className="space-y-1.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-cream/70">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              {f}
            </li>
          ))}
        </ul>
      );
    } },
  ];

  const gridCols = {
    gridTemplateColumns: `140px repeat(${selected.length}, minmax(220px, 1fr))`,
  };

  return (
    <div className="pt-28 pb-28">
      <Container size="wide">
        <header className="mb-14">
          <p className="eyebrow text-accent">{labels.compareEyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">
            {labels.compareTitle}
          </h1>
          <div className="rule mt-8" />
        </header>

        {!hydrated ? (
          <div className="min-h-[40vh]" />
        ) : selected.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-charcoal ring-1 ring-cream/10">
              <Scale className="h-7 w-7 text-accent" />
            </div>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/60">
              {labels.compareEmpty}
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
          <div className="overflow-x-auto pb-4">
            <div
              className="min-w-fit divide-y divide-cream/10 rounded-[var(--radius-base)] ring-1 ring-cream/10"
              role="table"
            >
              {/* Property headers */}
              <div className="grid gap-px" style={gridCols} role="row">
                <div className="bg-charcoal/40 p-5" />
                {selected.map((p) => {
                  const cover = p.images[0]?.url;
                  return (
                    <div key={p.id} className="relative bg-charcoal/40 p-5" role="columnheader">
                      <button
                        type="button"
                        onClick={() => removeCompare(p.id)}
                        aria-label={labels.remove}
                        className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-base/60 text-cream/70 ring-1 ring-cream/15 backdrop-blur-md transition-colors hover:text-accent"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-base)] bg-base/50">
                        {cover && (
                          <Image
                            src={cover}
                            alt={p.title}
                            fill
                            sizes="(max-width: 768px) 60vw, 300px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <h2 className="mt-4 font-display text-xl leading-snug text-cream">
                        {p.title}
                      </h2>
                      <Link
                        href={`/properties/${p.slug}`}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm tracking-wide text-accent transition-all hover:gap-2.5"
                      >
                        {labels.viewProperty}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Attribute rows */}
              {rows.map((row) => (
                <div key={row.label} className="grid gap-px" style={gridCols} role="row">
                  <div className="bg-base/20 p-5 text-sm uppercase tracking-widest text-cream/45">
                    {row.label}
                  </div>
                  {selected.map((p) => (
                    <div key={p.id} className="p-5 text-cream/80" role="cell">
                      {row.render(p)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

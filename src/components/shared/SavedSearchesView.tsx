"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, ArrowRight, Trash2 } from "lucide-react";
import { Container } from "./Container";
import {
  getSavedSearches,
  removeSavedSearch,
  type SavedSearch,
} from "@/lib/saved-searches";

export interface SavedSearchesLabels {
  title: string;
  eyebrow: string;
  empty: string;
  emptyCta: string;
  open: string;
  remove: string;
}

/**
 * Saved searches page body. Saved searches live in localStorage (no accounts),
 * so this hydrates client-side, lists each named filter set with a readable
 * summary, and links back to the listings page with those filters applied.
 */
export function SavedSearchesView({ labels }: { labels: SavedSearchesLabels }) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSearches(getSavedSearches());
    setHydrated(true);
  }, []);

  function remove(id: string) {
    setSearches(removeSavedSearch(id));
  }

  return (
    <div className="pt-28 pb-28">
      <Container>
        <header className="mb-14">
          <p className="eyebrow text-accent">{labels.eyebrow}</p>
          <h1 className="mt-3 flex items-center gap-4 font-display text-4xl text-cream sm:text-5xl">
            {labels.title}
            {hydrated && searches.length > 0 && (
              <span className="grid h-9 min-w-9 place-items-center rounded-full bg-accent px-2.5 font-sans text-lg font-medium text-base">
                {searches.length}
              </span>
            )}
          </h1>
          <div className="rule mt-8" />
        </header>

        {!hydrated ? (
          <div className="min-h-[40vh]" />
        ) : searches.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-charcoal ring-1 ring-cream/10">
              <Bookmark className="h-7 w-7 text-accent" />
            </div>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/60">
              {labels.empty}
            </p>
            <Link
              href="/listings"
              className="btn-glow mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium tracking-wide text-base transition-colors hover:bg-accent-soft"
            >
              {labels.emptyCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {searches.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-base)] border border-cream/10 bg-charcoal/40 p-5"
              >
                <div className="min-w-0">
                  <p className="font-display text-lg text-cream">{s.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {summarize(s.query).map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/60"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/listings${s.query ? `?${s.query}` : ""}`}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-base transition hover:bg-accent-soft"
                  >
                    {labels.open}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(s.id)}
                    aria-label={labels.remove}
                    className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/50 transition hover:border-red-400/50 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}

/** Turns a filter querystring into a handful of human-readable chips. */
function summarize(query: string): string[] {
  const p = new URLSearchParams(query);
  const chips: string[] = [];
  const lt = p.get("listingType");
  if (lt) chips.push(lt === "rent" ? "For rent" : "For sale");
  if (p.get("location")) chips.push(p.get("location") as string);
  if (p.get("type")) chips.push(p.get("type") as string);
  if (p.get("bedrooms")) chips.push(`${p.get("bedrooms")}+ bd`);
  if (p.get("bathrooms")) chips.push(`${p.get("bathrooms")}+ ba`);
  if (p.get("minPrice")) chips.push(`≥ €${p.get("minPrice")}`);
  if (p.get("maxPrice")) chips.push(`≤ €${p.get("maxPrice")}`);
  if (p.get("condition")) chips.push(p.get("condition") as string);
  if (p.get("energyRating")) chips.push(`Energy ${p.get("energyRating")}`);
  if (p.get("parking")) chips.push("Parking");
  if (p.get("elevator")) chips.push("Elevator");
  if (p.get("balcony")) chips.push("Balcony");
  if (chips.length === 0) chips.push("All properties");
  return chips;
}

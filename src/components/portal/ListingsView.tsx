"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Map as MapIcon,
  SearchX,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { MapViewDynamic } from "@/components/shared/MapViewDynamic";
import type { MapPin } from "@/components/shared/MapView";
import { cn } from "@/lib/cn";
import type { PropertyWithRelations } from "@/lib/queries";
import type { SortValue } from "./ListingsBrowser";

export interface ListingsViewLabels {
  grid: string;
  map: string;
  result: string;
  results: string;
  found: string; // "found"
  noResultsTitle: string;
  noResults: string;
  clear: string;
  sort: string;
  sortNewest: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortSize: string;
  sortPricePerM2: string;
  page: string; // "Page"
  of: string; // "of"
  prev: string;
  next: string;
}

/**
 * Portal results area: a live result count, a sort control, a grid ⇄ map toggle,
 * pagination for the grid and an elegant empty state. Receives the already
 * filtered + sorted list from ListingsBrowser; the grid shows one page at a
 * time while the map shows every matching pin.
 */
export function ListingsView({
  properties,
  featuredLabel,
  newLabel,
  labels,
  sort,
  onSortChange,
  onClear,
  hasFilters,
  page,
  pageSize,
  onPageChange,
}: {
  properties: PropertyWithRelations[];
  featuredLabel: string;
  newLabel: string;
  labels: ListingsViewLabels;
  sort: SortValue;
  onSortChange: (v: SortValue) => void;
  onClear: () => void;
  hasFilters: boolean;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const [view, setView] = useState<"grid" | "map">("grid");
  const count = properties.length;
  const hasResults = count > 0;

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const pageItems = properties.slice(start, start + pageSize);

  const pins: MapPin[] = properties
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      currency: p.currency,
      lat: p.lat as number,
      lng: p.lng as number,
    }));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-cream/60">
          <span className="font-display text-2xl font-semibold text-accent">
            {count}
          </span>{" "}
          {count === 1 ? labels.result : labels.results} {labels.found}
        </p>

        {hasResults && (
          <div className="flex items-center gap-3">
            {/* Sort */}
            <label className="flex items-center gap-2 rounded-full border border-cream/15 bg-cream/5 px-3 py-1.5 text-sm text-cream/80 focus-within:border-accent">
              <ArrowUpDown className="h-4 w-4 text-accent" />
              <span className="sr-only">{labels.sort}</span>
              <select
                aria-label={labels.sort}
                value={sort}
                onChange={(e) => onSortChange(e.target.value as SortValue)}
                className="bg-transparent pr-1 text-sm text-cream focus:outline-none [&>option]:text-base"
              >
                <option value="newest">{labels.sortNewest}</option>
                <option value="price_asc">{labels.sortPriceAsc}</option>
                <option value="price_desc">{labels.sortPriceDesc}</option>
                <option value="size">{labels.sortSize}</option>
                <option value="price_per_m2">{labels.sortPricePerM2}</option>
              </select>
            </label>

            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-full border border-cream/15 p-1">
              <ToggleBtn
                active={view === "grid"}
                onClick={() => setView("grid")}
                icon={<LayoutGrid className="h-4 w-4" />}
                label={labels.grid}
              />
              <ToggleBtn
                active={view === "map"}
                onClick={() => setView("map")}
                icon={<MapIcon className="h-4 w-4" />}
                label={labels.map}
              />
            </div>
          </div>
        )}
      </div>

      {!hasResults ? (
        <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-[var(--radius-base)] border border-dashed border-cream/12 px-6 py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-charcoal ring-1 ring-cream/10">
            <SearchX className="h-7 w-7 text-accent" />
          </div>
          <h3 className="mt-6 font-display text-2xl font-semibold text-cream">
            {labels.noResultsTitle}
          </h3>
          <p className="mt-3 max-w-md text-cream/55">{labels.noResults}</p>
          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="mt-7 rounded-full bg-accent px-6 py-2.5 text-sm font-medium tracking-wide text-base transition-colors hover:bg-accent-soft"
            >
              {labels.clear}
            </button>
          )}
        </div>
      ) : view === "grid" ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                featuredLabel={featuredLabel}
                newLabel={newLabel}
              />
            ))}
          </div>
          <Pagination
            page={current}
            totalPages={totalPages}
            onPageChange={onPageChange}
            labels={labels}
          />
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="order-2 max-h-[75vh] space-y-4 overflow-y-auto pr-2 lg:order-1">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                featuredLabel={featuredLabel}
                newLabel={newLabel}
              />
            ))}
          </div>
          <div className="order-1 h-[50vh] lg:sticky lg:top-24 lg:order-2 lg:h-[75vh]">
            <MapViewDynamic pins={pins} className="h-full w-full" />
          </div>
        </div>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  labels,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  labels: ListingsViewLabels;
}) {
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    onPageChange(Math.min(Math.max(1, p), totalPages));
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Compact window of page numbers around the current page.
  const windowSize = 5;
  let from = Math.max(1, page - Math.floor(windowSize / 2));
  const to = Math.min(totalPages, from + windowSize - 1);
  from = Math.max(1, to - windowSize + 1);
  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 rounded-full border border-cream/15 px-3 py-2 text-sm text-cream/70 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{labels.prev}</span>
      </button>

      {from > 1 && (
        <>
          <PageBtn n={1} active={page === 1} onClick={() => go(1)} />
          <span className="px-1 text-cream/30">…</span>
        </>
      )}

      {pages.map((p) => (
        <PageBtn key={p} n={p} active={p === page} onClick={() => go(p)} />
      ))}

      {to < totalPages && (
        <>
          <span className="px-1 text-cream/30">…</span>
          <PageBtn
            n={totalPages}
            active={page === totalPages}
            onClick={() => go(totalPages)}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 rounded-full border border-cream/15 px-3 py-2 text-sm text-cream/70 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
      >
        <span className="hidden sm:inline">{labels.next}</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function PageBtn({
  n,
  active,
  onClick,
}: {
  n: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "h-9 min-w-9 rounded-full px-3 text-sm transition",
        active
          ? "bg-accent font-medium text-base"
          : "border border-cream/15 text-cream/70 hover:border-accent hover:text-accent",
      )}
    >
      {n}
    </button>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs transition",
        active ? "bg-accent text-base" : "text-cream/70 hover:text-accent",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

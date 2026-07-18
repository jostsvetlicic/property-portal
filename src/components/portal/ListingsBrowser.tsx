"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FilterBar, type FilterKey, type FilterLabels, type FilterValues } from "./FilterBar";
import { ListingsView, type ListingsViewLabels } from "./ListingsView";
import { BuyRentToggle, type BuyRentLabels } from "@/components/shared/BuyRentToggle";
import { SaveSearch, type SaveSearchLabels } from "@/components/shared/SaveSearch";
import type { PropertyWithRelations } from "@/lib/queries";

export type SortValue =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "size"
  | "price_per_m2";

/** How many listings render per page in the grid view. */
export const PAGE_SIZE = 24;

interface BrowserState extends FilterValues {
  listingType: string; // "" | "sale" | "rent"
  sort: SortValue;
}

const EMPTY: BrowserState = {
  listingType: "",
  location: "",
  type: "",
  bedrooms: "",
  bathrooms: "",
  minPrice: "",
  maxPrice: "",
  condition: "",
  energyRating: "",
  parking: "",
  elevator: "",
  balcony: "",
  sort: "newest",
};

/**
 * Portal listings engine. Receives the FULL property set once from the server
 * and does all filtering + sorting in-memory, so every control gives instant
 * results with no page reload. The grid is paginated (PAGE_SIZE per page) for
 * volume; the map view shows every matching pin. The URL is kept in sync
 * (history.replaceState) so a filtered view is shareable and survives a refresh
 * — but the URL is a mirror of state, not the driver, which keeps it instant.
 */
export function ListingsBrowser({
  properties,
  locations,
  initial,
  featuredLabel,
  newLabel,
  buyRentLabels,
  saveSearchLabels,
  filterLabels,
  viewLabels,
}: {
  properties: PropertyWithRelations[];
  locations: string[];
  initial: BrowserState;
  featuredLabel: string;
  newLabel: string;
  buyRentLabels: BuyRentLabels;
  saveSearchLabels: SaveSearchLabels;
  filterLabels: FilterLabels;
  viewLabels: ListingsViewLabels;
}) {
  const [state, setState] = useState<BrowserState>(initial);
  const [page, setPage] = useState(1);
  const firstRender = useRef(true);

  const setFilter = useCallback((key: FilterKey, value: string) => {
    setState((s) => ({ ...s, [key]: value }));
  }, []);

  const setListingType = useCallback((listingType: string) => {
    setState((s) => ({ ...s, listingType }));
  }, []);

  const setSort = useCallback((sort: SortValue) => {
    setState((s) => ({ ...s, sort }));
  }, []);

  const clear = useCallback(() => {
    setState((s) => ({ ...EMPTY, sort: s.sort }));
  }, []);

  // Reset to the first page whenever the filters or sort change (but not on the
  // very first render, so a shared ?page-less URL still starts on page 1).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setPage(1);
  }, [state]);

  // Keep the URL as a shareable mirror of the current selection.
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.listingType) params.set("listingType", state.listingType);
    if (state.location) params.set("location", state.location);
    if (state.type) params.set("type", state.type);
    if (state.bedrooms) params.set("bedrooms", state.bedrooms);
    if (state.bathrooms) params.set("bathrooms", state.bathrooms);
    if (state.minPrice) params.set("minPrice", state.minPrice);
    if (state.maxPrice) params.set("maxPrice", state.maxPrice);
    if (state.condition) params.set("condition", state.condition);
    if (state.energyRating) params.set("energyRating", state.energyRating);
    if (state.parking) params.set("parking", "1");
    if (state.elevator) params.set("elevator", "1");
    if (state.balcony) params.set("balcony", "1");
    if (state.sort !== "newest") params.set("sort", state.sort);
    const qs = params.toString();
    window.history.replaceState(null, "", `/listings${qs ? `?${qs}` : ""}`);
  }, [state]);

  const results = useMemo(() => {
    const min = Number(state.minPrice) || 0;
    const max = Number(state.maxPrice) || Infinity;
    const beds = Number(state.bedrooms) || 0;
    const baths = Number(state.bathrooms) || 0;
    const loc = state.location.toLowerCase();

    const filtered = properties.filter((p) => {
      if (state.listingType && p.listingType !== state.listingType) return false;
      if (loc && !p.location.toLowerCase().includes(loc)) return false;
      if (state.type && p.type !== state.type) return false;
      if (p.bedrooms < beds) return false;
      if (p.bathrooms < baths) return false;
      if (p.price < min || p.price > max) return false;
      if (state.condition && p.condition !== state.condition) return false;
      if (state.energyRating && p.energyRating !== state.energyRating) return false;
      if (state.parking && !p.parking) return false;
      if (state.elevator && !p.elevator) return false;
      if (state.balcony && !p.balcony) return false;
      return true;
    });

    const perM2 = (p: PropertyWithRelations) =>
      p.area > 0 ? p.price / p.area : Infinity;

    const bySort = (a: PropertyWithRelations, b: PropertyWithRelations) => {
      if (state.sort === "price_asc") return a.price - b.price;
      if (state.sort === "price_desc") return b.price - a.price;
      if (state.sort === "size") return b.area - a.area;
      if (state.sort === "price_per_m2") return perM2(a) - perM2(b);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    };

    // Featured listings are pinned to the top, then the chosen sort applies.
    return [...filtered].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return bySort(a, b);
    });
  }, [properties, state]);

  const hasFilters =
    Boolean(state.listingType) ||
    Boolean(state.location) ||
    Boolean(state.type) ||
    Boolean(state.bedrooms) ||
    Boolean(state.bathrooms) ||
    Boolean(state.minPrice) ||
    Boolean(state.maxPrice) ||
    Boolean(state.condition) ||
    Boolean(state.energyRating) ||
    Boolean(state.parking) ||
    Boolean(state.elevator) ||
    Boolean(state.balcony);

  // The querystring the current selection maps to (used to save searches).
  const currentQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (state.listingType) params.set("listingType", state.listingType);
    if (state.location) params.set("location", state.location);
    if (state.type) params.set("type", state.type);
    if (state.bedrooms) params.set("bedrooms", state.bedrooms);
    if (state.bathrooms) params.set("bathrooms", state.bathrooms);
    if (state.minPrice) params.set("minPrice", state.minPrice);
    if (state.maxPrice) params.set("maxPrice", state.maxPrice);
    if (state.condition) params.set("condition", state.condition);
    if (state.energyRating) params.set("energyRating", state.energyRating);
    if (state.parking) params.set("parking", "1");
    if (state.elevator) params.set("elevator", "1");
    if (state.balcony) params.set("balcony", "1");
    if (state.sort !== "newest") params.set("sort", state.sort);
    return params.toString();
  }, [state]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <BuyRentToggle
          value={state.listingType}
          onChange={setListingType}
          labels={buyRentLabels}
        />
        <SaveSearch query={currentQuery} labels={saveSearchLabels} />
      </div>

      <FilterBar
        labels={filterLabels}
        locations={locations}
        values={{
          location: state.location,
          type: state.type,
          bedrooms: state.bedrooms,
          bathrooms: state.bathrooms,
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          condition: state.condition,
          energyRating: state.energyRating,
          parking: state.parking,
          elevator: state.elevator,
          balcony: state.balcony,
        }}
        onChange={setFilter}
        onClear={clear}
        hasFilters={hasFilters}
      />

      <div className="mt-10">
        <ListingsView
          properties={results}
          featuredLabel={featuredLabel}
          newLabel={newLabel}
          labels={viewLabels}
          sort={state.sort}
          onSortChange={setSort}
          onClear={clear}
          hasFilters={hasFilters}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}

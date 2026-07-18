"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { PROPERTY_TYPES } from "@/types";
import { BuyRentToggle } from "./BuyRentToggle";
import { cn } from "@/lib/cn";

export interface PropertySearchLabels {
  location: string;
  anyLocation: string;
  type: string;
  anyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  any: string;
  search: string;
  buy: string;
  rent: string;
}

/** Current filter values used to prefill the form (e.g. on the listings page). */
export interface PropertySearchInitial {
  listingType?: string;
  location?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
}

/**
 * Unified property search used across both modes. It filters by location, type,
 * price range (min/max), bedrooms and bathrooms, then navigates to /listings
 * with the selection encoded as URL search params (server reads them and
 * renders results). One component, two presentations:
 *   - variant="hero"    → large, central, for the portal home hero.
 *   - variant="minimal" → understated, for boutique (home + listings).
 */
export function PropertySearch({
  variant,
  locations,
  labels,
  initial,
  className,
}: {
  variant: "hero" | "minimal";
  locations: string[];
  labels: PropertySearchLabels;
  initial?: PropertySearchInitial;
  className?: string;
}) {
  const router = useRouter();

  const [listingType, setListingType] = useState(initial?.listingType ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [minPrice, setMinPrice] = useState(initial?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initial?.maxPrice ?? "");
  const [bedrooms, setBedrooms] = useState(initial?.bedrooms ?? "");
  const [bathrooms, setBathrooms] = useState(initial?.bathrooms ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.set("listingType", listingType);
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (bathrooms) params.set("bathrooms", bathrooms);
    const qs = params.toString();
    router.push(`/listings${qs ? `?${qs}` : ""}`);
  }

  const hero = variant === "hero";

  const fieldCls = cn(
    "w-full bg-transparent text-cream focus:outline-none [&>option]:text-base placeholder:text-cream/30",
    hero ? "text-sm" : "text-sm",
  );

  return (
    <div className={cn(hero ? "space-y-4" : "space-y-3", className)}>
      <BuyRentToggle
        value={listingType}
        onChange={setListingType}
        labels={{ buy: labels.buy, rent: labels.rent }}
        size={hero ? "lg" : "md"}
      />
      <form
        onSubmit={onSubmit}
        className={cn(
          hero
            ? "grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-base)] border border-cream/15 bg-cream/10 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-wrap items-end gap-x-6 gap-y-4 rounded-[var(--radius-base)] border border-cream/10 bg-charcoal/40 px-6 py-5 backdrop-blur-sm",
        )}
      >
      <FieldWrap variant={variant} label={labels.location}>
        <select
          aria-label={labels.location}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={fieldCls}
        >
          <option value="">{labels.anyLocation}</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </FieldWrap>

      <FieldWrap variant={variant} label={labels.type}>
        <select
          aria-label={labels.type}
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={fieldCls}
        >
          <option value="">{labels.anyType}</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FieldWrap>

      <FieldWrap variant={variant} label={labels.bedrooms}>
        <select
          aria-label={labels.bedrooms}
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className={fieldCls}
        >
          <option value="">{labels.any}</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </FieldWrap>

      <FieldWrap variant={variant} label={labels.bathrooms}>
        <select
          aria-label={labels.bathrooms}
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          className={fieldCls}
        >
          <option value="">{labels.any}</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </FieldWrap>

      <FieldWrap variant={variant} label={labels.minPrice}>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={100000}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder={labels.any}
          aria-label={labels.minPrice}
          className={fieldCls}
        />
      </FieldWrap>

      <FieldWrap variant={variant} label={labels.maxPrice}>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={100000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder={labels.any}
          aria-label={labels.maxPrice}
          className={fieldCls}
        />
      </FieldWrap>

      {hero ? (
        <button
          type="submit"
          className="col-span-full flex items-center justify-center gap-2 bg-accent px-8 py-4 text-sm font-medium tracking-wide text-base transition-colors hover:bg-accent-soft"
        >
          <Search className="h-4 w-4" />
          {labels.search}
        </button>
      ) : (
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium tracking-wide text-base transition-colors hover:bg-accent-soft"
        >
          <Search className="h-4 w-4" />
          {labels.search}
        </button>
      )}
      </form>
    </div>
  );
}

function FieldWrap({
  variant,
  label,
  children,
}: {
  variant: "hero" | "minimal";
  label: string;
  children: React.ReactNode;
}) {
  if (variant === "hero") {
    return (
      <div className="flex flex-col justify-center gap-1 bg-base/40 px-5 py-3.5">
        <span className="text-[0.65rem] uppercase tracking-widest text-accent">
          {label}
        </span>
        {children}
      </div>
    );
  }
  // minimal
  return (
    <label className="flex min-w-[7rem] flex-1 flex-col gap-1">
      <span className="text-[0.6rem] uppercase tracking-widest text-cream/45">
        {label}
      </span>
      <div className="border-b border-cream/15 pb-1.5 focus-within:border-accent">
        {children}
      </div>
    </label>
  );
}

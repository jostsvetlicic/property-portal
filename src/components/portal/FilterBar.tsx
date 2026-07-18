"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { PROPERTY_TYPES, CONDITIONS, ENERGY_RATINGS } from "@/types";
import { cn } from "@/lib/cn";

export interface FilterLabels {
  location: string;
  anyLocation: string;
  type: string;
  anyType: string;
  bedrooms: string;
  bathrooms: string;
  any: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  anyCondition: string;
  energy: string;
  anyEnergy: string;
  parking: string;
  elevator: string;
  balcony: string;
  clear: string;
  filters: string;
}

/** The listing filters. Booleans are "" (off) or "1" (on). */
export interface FilterValues {
  location: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  energyRating: string;
  parking: string;
  elevator: string;
  balcony: string;
}

export type FilterKey = keyof FilterValues;

/**
 * Portal-mode filter bar. Fully controlled — every control reports changes up to
 * the ListingsBrowser, which filters the result set in-memory for instant
 * feedback (no page reload) while keeping the URL in sync for shareable links.
 */
export function FilterBar({
  labels,
  locations,
  values,
  onChange,
  onClear,
  hasFilters,
}: {
  labels: FilterLabels;
  locations: string[];
  values: FilterValues;
  onChange: (key: FilterKey, value: string) => void;
  onClear: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="sticky top-[72px] z-30 rounded-[var(--radius-base)] border border-cream/10 bg-charcoal/85 p-4 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3">
        <span className="hidden items-center gap-2 text-xs uppercase tracking-widest text-accent sm:flex">
          <SlidersHorizontal className="h-4 w-4" />
          {labels.filters}
        </span>

        <Select
          value={values.location}
          onChange={(v) => onChange("location", v)}
          label={labels.location}
        >
          <option value="">{labels.anyLocation}</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>

        <Select
          value={values.type}
          onChange={(v) => onChange("type", v)}
          label={labels.type}
        >
          <option value="">{labels.anyType}</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>

        <Select
          value={values.bedrooms}
          onChange={(v) => onChange("bedrooms", v)}
          label={labels.bedrooms}
        >
          <option value="">{labels.bedrooms}</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </Select>

        <Select
          value={values.bathrooms}
          onChange={(v) => onChange("bathrooms", v)}
          label={labels.bathrooms}
        >
          <option value="">{labels.bathrooms}</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </Select>

        <NumberInput
          value={values.minPrice}
          onChange={(v) => onChange("minPrice", v)}
          placeholder={labels.minPrice}
        />
        <NumberInput
          value={values.maxPrice}
          onChange={(v) => onChange("maxPrice", v)}
          placeholder={labels.maxPrice}
        />

        <Select
          value={values.condition}
          onChange={(v) => onChange("condition", v)}
          label={labels.condition}
        >
          <option value="">{labels.anyCondition}</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select
          value={values.energyRating}
          onChange={(v) => onChange("energyRating", v)}
          label={labels.energy}
        >
          <option value="">{labels.anyEnergy}</option>
          {ENERGY_RATINGS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </Select>

        <Toggle
          active={values.parking === "1"}
          onClick={() => onChange("parking", values.parking ? "" : "1")}
          label={labels.parking}
        />
        <Toggle
          active={values.elevator === "1"}
          onClick={() => onChange("elevator", values.elevator ? "" : "1")}
          label={labels.elevator}
        />
        <Toggle
          active={values.balcony === "1"}
          onClick={() => onChange("balcony", values.balcony ? "" : "1")}
          label={labels.balcony}
        />

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto flex items-center gap-1.5 rounded-full border border-cream/15 px-4 py-2 text-xs text-cream/70 transition hover:border-accent hover:text-accent"
          >
            <X className="h-3.5 w-3.5" />
            {labels.clear}
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-cream/15 bg-cream/5 px-4 py-2 text-sm text-cream focus:border-accent focus:outline-none [&>option]:text-base"
    >
      {children}
    </select>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      value={value}
      placeholder={placeholder}
      min={0}
      step={10000}
      onChange={(e) => onChange(e.target.value)}
      className="w-28 rounded-full border border-cream/15 bg-cream/5 px-4 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-accent focus:outline-none"
    />
  );
}

function Toggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-accent bg-accent/15 text-accent"
          : "border-cream/15 text-cream/70 hover:border-accent hover:text-accent",
      )}
    >
      {label}
    </button>
  );
}

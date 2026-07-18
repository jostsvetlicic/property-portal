"use client";

import { cn } from "@/lib/cn";

export interface BuyRentLabels {
  buy: string;
  rent: string;
}

/**
 * Prominent Buy / Rent switch used on the home hero and the listings page.
 * A value of "" means "all" (no filter). Fully controlled — reports the chosen
 * listing type up to the parent, which filters everything below it.
 */
export function BuyRentToggle({
  value,
  onChange,
  labels,
  size = "md",
  className,
}: {
  value: string; // "" | "sale" | "rent"
  onChange: (v: string) => void;
  labels: BuyRentLabels;
  size?: "md" | "lg";
  className?: string;
}) {
  const options: { key: string; label: string }[] = [
    { key: "sale", label: labels.buy },
    { key: "rent", label: labels.rent },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-cream/15 bg-base/40 p-1 backdrop-blur-sm",
        className,
      )}
      role="tablist"
    >
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(active ? "" : o.key)}
            className={cn(
              "rounded-full font-medium tracking-wide transition-colors",
              size === "lg" ? "px-7 py-2.5 text-sm" : "px-5 py-2 text-sm",
              active
                ? "bg-accent text-base"
                : "text-cream/70 hover:text-accent",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

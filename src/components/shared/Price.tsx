"use client";

import {
  convertPrice,
  formatPrice,
  formatPriceCompact,
} from "@/lib/format";
import { useCurrency } from "./CurrencyProvider";

/**
 * Currency-aware price display. Reads the active display currency from the
 * CurrencyProvider, converts the stored (base-currency) amount and formats it.
 * `compact` uses the short M/K form for tight card layouts. Rent listings
 * (`listingType="rent"`) append a "/mo" suffix so monthly prices read clearly.
 */
export function Price({
  amount,
  base = "EUR",
  compact = false,
  listingType,
  className,
}: {
  amount: number;
  base?: string;
  compact?: boolean;
  listingType?: string;
  className?: string;
}) {
  const { currency } = useCurrency();
  const value = convertPrice(amount, base, currency);
  const text = compact
    ? formatPriceCompact(value, currency)
    : formatPrice(value, currency);
  return (
    <span className={className}>
      {text}
      {listingType === "rent" && (
        <span className="text-cream/50">/mo</span>
      )}
    </span>
  );
}

/**
 * Currency-aware price-per-square-meter display, derived from a total price and
 * living area. Renders nothing when the area is unknown.
 */
export function PricePerM2({
  price,
  area,
  base = "EUR",
  className,
}: {
  price: number;
  area: number;
  base?: string;
  className?: string;
}) {
  const { currency } = useCurrency();
  if (!area || area <= 0) return null;
  const perM2 = convertPrice(price / area, base, currency);
  return (
    <span className={className}>
      {formatPrice(Math.round(perM2), currency)}/m²
    </span>
  );
}

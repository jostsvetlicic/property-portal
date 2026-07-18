/**
 * Formatting helpers for prices, areas and other display values.
 */

/** Display currencies the front-end can switch between. */
export type CurrencyCode = "EUR" | "USD";

/**
 * Indicative EUR-based conversion rates for the display-currency toggle.
 * Prices are stored in a single base currency (EUR) in the DB; the toggle only
 * changes how they are *displayed*. These are static, indicative figures — not
 * a live FX feed — which is appropriate for headline luxury pricing.
 */
export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
};

/**
 * Converts an amount from its stored base currency into a target display
 * currency using the indicative rates above.
 */
export function convertPrice(
  amount: number,
  base: string,
  target: CurrencyCode,
): number {
  const from = CURRENCY_RATES[base as CurrencyCode] ?? 1;
  const to = CURRENCY_RATES[target] ?? 1;
  return (amount / from) * to;
}

/**
 * Formats a whole-euro integer as a currency string, e.g. 2450000 -> "€2,450,000".
 * Uses no decimal places since luxury prices are round figures.
 */
export function formatPrice(
  amount: number,
  currency: string = "EUR",
  locale: string = "en-GB",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Compact price for tight card layouts, e.g. 2450000 -> "€2.45M". */
export function formatPriceCompact(amount: number, currency = "EUR"): string {
  const symbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "";
  if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`;
  }
  if (amount >= 1_000) {
    return `${symbol}${Math.round(amount / 1_000)}K`;
  }
  return `${symbol}${amount}`;
}

/** Formats an area in square meters, e.g. 320 -> "320 m²". */
export function formatArea(area: number): string {
  return `${new Intl.NumberFormat("en-GB").format(area)} m²`;
}

/**
 * Price per square meter, derived from a total price and living area, e.g.
 * (250000, 80) -> "€3,125/m²". Returns null when the area is unknown so callers
 * can hide the figure rather than divide by zero.
 */
export function formatPricePerM2(
  price: number,
  area: number,
  currency: string = "EUR",
): string | null {
  if (!area || area <= 0) return null;
  const perM2 = Math.round(price / area);
  return `${formatPrice(perM2, currency)}/m²`;
}

/** Raw price-per-m² number (rounded), or null when area is unknown. */
export function pricePerM2(price: number, area: number): number | null {
  if (!area || area <= 0) return null;
  return Math.round(price / area);
}

/**
 * Appends "/mo" to a formatted price for rental listings, so a monthly rent
 * reads e.g. "€1,200/mo". Sale listings pass through unchanged.
 */
export function withRentSuffix(
  formatted: string,
  listingType: string,
): string {
  return listingType === "rent" ? `${formatted}/mo` : formatted;
}

/** Safely parses the JSON-encoded `features` string from the DB. */
export function parseFeatures(features: string | null | undefined): string[] {
  if (!features) return [];
  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed.filter((f) => typeof f === "string") : [];
  } catch {
    return [];
  }
}

/** Builds a URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

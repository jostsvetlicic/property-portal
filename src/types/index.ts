/**
 * Shared application types.
 *
 * These types describe the central agency configuration (branding + mode) and
 * the runtime settings object that the rest of the app consumes. The runtime
 * settings are produced by merging the config file defaults with the DB
 * `Settings` row (see `src/lib/settings.ts`).
 */

/** The two front-end experiences the platform can run in. */
export type Mode = "portal" | "boutique";

/** Supported UI locales. Extend this list when cloning for a new market. */
export type Locale = "en" | "sl";

/** The property categories used across filters and forms. */
export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Land",
  "Commercial",
  "Office",
  "Garage",
  "Weekend House",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

/**
 * Whether a listing is for sale or for rent. Drives the Buy/Rent toggle across
 * the home and listings pages; rent listings show a monthly price, sale
 * listings show a total price.
 */
export const LISTING_TYPES = ["sale", "rent"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

/** Building condition, shown in specs and offered as a filter. */
export const CONDITIONS = [
  "New build",
  "Renovated",
  "Good",
  "Needs renovation",
] as const;
export type Condition = (typeof CONDITIONS)[number];

/** EU energy-performance certificate ratings (A best → G worst). */
export const ENERGY_RATINGS = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type EnergyRating = (typeof ENERGY_RATINGS)[number];

/** Availability status shown as a badge on cards and detail pages. */
export const PROPERTY_STATUSES = ["available", "reserved", "sold"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

/**
 * The central, per-agency configuration.
 *
 * Everything branding-related lives here so a clone can be re-skinned by
 * editing a single file. The `mode` value here is the DEFAULT — it can be
 * overridden at runtime by the admin via the DB `Settings` row.
 */
export interface AgencyConfig {
  /** Default front-end mode. Overridable in the admin settings page. */
  mode: Mode;
  /** Full agency name, used in metadata and prose. */
  name: string;
  /** Short wordmark shown in the nav/footer (often uppercased). */
  logoText: string;
  /** One-line brand tagline. */
  tagline: string;
  /** Contact details surfaced in the footer, contact page and inquiry emails. */
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsapp?: string;
    instagram?: string;
    /** Office coordinates for the contact-page map (optional). */
    lat?: number;
    lng?: number;
  };
  /** Visual theme. Colors are injected as CSS variables for re-skinning. */
  theme: {
    colors: {
      /** Warm near-black page base. */
      base: string;
      /** Slightly lighter charcoal for panels/cards. */
      charcoal: string;
      /** Cream / off-white used for light sections and text on dark. */
      cream: string;
      /** Muted gold accent — the single brand-defining color. */
      accent: string;
      /** Softer accent for hovers/gradients. */
      accentSoft: string;
      /** Muted foreground for secondary text. */
      muted: string;
    };
    /** Base border radius (nothing sharp). */
    radius: string;
    /** Google font family names, loaded via next/font. */
    fonts: {
      display: string;
      body: string;
    };
  };
  defaultLocale: Locale;
  locales: Locale[];
}

/**
 * Runtime settings consumed by the app. This is the config file merged with
 * any DB overrides. Only the fields the admin can edit live in the DB; the
 * rest fall back to the config file.
 */
export interface RuntimeSettings {
  mode: Mode;
  name: string;
  logoText: string;
  tagline: string;
  accentColor: string;
  baseColor: string;
  creamColor: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsapp?: string;
    instagram?: string;
    /** Office coordinates for the contact-page map (optional). */
    lat?: number;
    lng?: number;
  };
  theme: AgencyConfig["theme"];
  defaultLocale: Locale;
  locales: Locale[];
}

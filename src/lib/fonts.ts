import { Inter } from "next/font/google";

/**
 * Fonts are loaded with `next/font` for zero-layout-shift, self-hosted delivery.
 *
 * NOTE: `next/font/google` requires font family names to be known at build
 * time, so the two families here mirror `agencyConfig.theme.fonts`. If you
 * change the fonts in the central config for a clone, also swap the imports in
 * this one file. Everything else reads the CSS variables below, so no other
 * file needs to change.
 *
 * This clone is a practical marketplace, so headings use a heavier weight of the
 * same clean sans (Inter) rather than an editorial serif.
 */

/** Display sans — headings. Exposed as `--font-display`. */
export const displayFont = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

/** Clean body sans — paragraphs and UI. Exposed as `--font-body`. */
export const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

/** Combined className to place on <html>. */
export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;

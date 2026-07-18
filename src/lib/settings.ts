import { cache } from "react";
import { agencyConfig } from "@config";
import { prisma } from "@/lib/db";
import type { Mode, RuntimeSettings } from "@/types";

/**
 * Runtime settings resolution.
 *
 * The effective settings are the central config file (agency.config.ts)
 * OVERRIDDEN by the single DB `Settings` row (id = 1), which the admin can edit
 * live. This gives us the best of both:
 *   - Cloning a new agency = edit one config file.
 *   - Changing mode/branding at runtime = edit the DB via the admin, no deploy.
 *
 * `cache()` dedupes the DB read within a single server render pass.
 */
export const getSettings = cache(async (): Promise<RuntimeSettings> => {
  const cfg = agencyConfig;

  // Defaults derived entirely from the config file.
  const defaults: RuntimeSettings = {
    mode: cfg.mode,
    name: cfg.name,
    logoText: cfg.logoText,
    tagline: cfg.tagline,
    accentColor: cfg.theme.colors.accent,
    baseColor: cfg.theme.colors.base,
    creamColor: cfg.theme.colors.cream,
    contact: cfg.contact,
    theme: cfg.theme,
    defaultLocale: cfg.defaultLocale,
    locales: cfg.locales,
  };

  try {
    const row = await prisma.settings.findUnique({ where: { id: 1 } });
    if (!row) return defaults;

    // DB overrides win where present.
    return {
      ...defaults,
      mode: (row.mode as Mode) ?? defaults.mode,
      name: row.name || defaults.name,
      logoText: row.logoText || defaults.logoText,
      tagline: row.tagline || defaults.tagline,
      accentColor: row.accentColor || defaults.accentColor,
      baseColor: row.baseColor || defaults.baseColor,
      creamColor: row.creamColor || defaults.creamColor,
      contact: {
        email: row.email || defaults.contact.email,
        phone: row.phone || defaults.contact.phone,
        address: row.address || defaults.contact.address,
        whatsapp: defaults.contact.whatsapp,
        instagram: defaults.contact.instagram,
        lat: defaults.contact.lat,
        lng: defaults.contact.lng,
      },
    };
  } catch {
    // DB not reachable (e.g. before first migration) — fall back to config.
    return defaults;
  }
});

/** Convenience helper: the effective front-end mode. */
export async function getMode(): Promise<Mode> {
  const s = await getSettings();
  return s.mode;
}

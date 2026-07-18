import { cookies } from "next/headers";
import { agencyConfig } from "@config";
import en from "../../messages/en.json";
import sl from "../../messages/sl.json";
import type { Locale } from "@/types";

/**
 * Lightweight i18n for UI chrome (nav, labels, buttons, section copy).
 *
 * Property CONTENT is entered by the admin in a single language; only the
 * surrounding interface is translated. This keeps the system fast and trivial
 * to extend — add a locale to `agency.config.ts`, drop a JSON file in
 * `messages/`, and register it in `dictionaries` below.
 */

export const COOKIE_NAME = "locale";

type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  sl: sl as Dictionary,
};

/** Reads the active locale from the cookie, falling back to the config default. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value as Locale | undefined;
  if (value && agencyConfig.locales.includes(value)) return value;
  return agencyConfig.defaultLocale;
}

/** Returns the full message dictionary for a locale. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[agencyConfig.defaultLocale];
}

/**
 * Server helper: returns the active locale plus a `t()` lookup function.
 *
 * Usage:
 *   const { t } = await getTranslations();
 *   t("nav.listings")
 */
export async function getTranslations() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = (key: string): string => resolveKey(dict, key);
  return { locale, t, dict };
}

/** Resolves a dotted key path ("nav.listings") against a dictionary object. */
export function resolveKey(dict: unknown, key: string): string {
  const value = key
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      dict,
    );
  return typeof value === "string" ? value : key;
}

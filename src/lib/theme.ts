import type { RuntimeSettings } from "@/types";

/**
 * Converts a hex color (#RRGGBB or #RGB) into a space-separated "R G B" string.
 *
 * We store colors this way in CSS variables so Tailwind's `<alpha-value>`
 * syntax works — e.g. `rgb(var(--color-accent) / 0.5)` for 50% opacity.
 */
export function hexToRgbTriplet(hex: string): string {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Builds the CSS-variable declarations for `:root` from the runtime settings.
 *
 * Injected once (server-side) in the root layout via a <style> tag, so the
 * whole site is themed before first paint and can be re-skinned by changing
 * the config file or the admin settings — with no rebuild.
 */
export function buildThemeCss(settings: RuntimeSettings): string {
  const c = settings.theme.colors;
  // Admin-editable overrides take precedence over the config file colors.
  const accent = settings.accentColor || c.accent;
  const base = settings.baseColor || c.base;
  const cream = settings.creamColor || c.cream;

  const vars: Record<string, string> = {
    "--color-base": hexToRgbTriplet(base),
    "--color-charcoal": hexToRgbTriplet(c.charcoal),
    "--color-cream": hexToRgbTriplet(cream),
    "--color-accent": hexToRgbTriplet(accent),
    "--color-accent-soft": hexToRgbTriplet(c.accentSoft),
    "--color-muted": hexToRgbTriplet(c.muted),
    "--radius-base": settings.theme.radius,
  };

  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");

  return `:root {\n${body}\n}`;
}

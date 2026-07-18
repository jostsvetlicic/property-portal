import type { AgencyConfig } from "@/types";

/**
 * ============================================================================
 *  CENTRAL AGENCY CONFIG  —  the ONE file you edit to re-skin this platform.
 * ============================================================================
 *
 * Everything an agency needs to brand the site lives here: name, wordmark,
 * colors, accent, fonts, contact details and the default front-end `mode`.
 * Nothing branding-related is hardcoded elsewhere.
 *
 * HOW RE-SKINNING WORKS
 *  - Colors below are injected as CSS variables on <html> (see src/lib/theme.ts
 *    and src/app/layout.tsx). Tailwind classes like `bg-accent` / `text-base`
 *    resolve to those variables, so changing a hex here re-skins every screen.
 *  - Fonts are loaded through next/font using the family names below.
 *  - To brand a new agency: clone the repo, edit this file, run `npm run seed`,
 *    then deploy. Done.
 *
 * HOW THE MODE SWITCH WORKS
 *  - `mode` here is the DEFAULT. The admin Settings page can override it at
 *    runtime (stored in the DB) without a redeploy. See src/lib/settings.ts.
 *  - "portal"   = high-volume marketplace: search + filters + map are the hero.
 *  - "boutique" = curated ultra-luxury: cinematic cards + storytelling.
 */
export const agencyConfig: AgencyConfig = {
  mode: "portal",

  name: "Property Portal",
  logoText: "PROPERTY PORTAL",
  tagline: "Buy, sell and rent property across Slovenia and Croatia",

  contact: {
    email: "info@propertyportal.si",
    phone: "+386 1 620 4400",
    address: "Dunajska cesta 156, 1000 Ljubljana, Slovenia",
    whatsapp: "+386 40 620 440",
    instagram: "propertyportal",
    lat: 46.0685,
    lng: 14.5136,
  },

  theme: {
    colors: {
      base: "#1A1D21", // clean graphite page base
      charcoal: "#23272E", // panels / cards
      cream: "#F4F6F8", // near-white text
      accent: "#4A7FB5", // steel blue — the brand color
      accentSoft: "#6C9CCB", // lighter steel blue for hovers/gradients
      muted: "#8A929C", // secondary text
    },
    radius: "0.5rem",
    fonts: {
      display: "Inter", // clean sans for headings (practical, not editorial)
      body: "Inter", // clean sans for body
    },
  },

  defaultLocale: "en",
  locales: ["en", "sl"],
};

export default agencyConfig;

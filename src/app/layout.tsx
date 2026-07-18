import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { fontVariables } from "@/lib/fonts";
import { getSettings } from "@/lib/settings";
import { getLocale } from "@/lib/i18n";
import { buildThemeCss } from "@/lib/theme";

/**
 * Root layout.
 *
 * Responsibilities:
 *  - Load the branded fonts (next/font) exposed as CSS variables.
 *  - Inject the theme CSS variables from the runtime settings so the whole
 *    site is themed before first paint (and re-skins with the config/admin).
 *  - Set <html lang> from the active locale.
 *  - Provide metadata derived from the agency settings.
 */

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: `${settings.name} — ${settings.tagline}`,
      template: `%s · ${settings.name}`,
    },
    description: settings.tagline,
    openGraph: {
      title: settings.name,
      description: settings.tagline,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  const themeCss = buildThemeCss(settings);

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        {/* Runtime theme variables — the re-skin injection point. */}
        <style
          id="agency-theme"
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

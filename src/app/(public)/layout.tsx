import { Nav, type NavLabels } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { ScrollFX } from "@/components/shared/ScrollFX";
import { SavedProvider, type SavedLabels } from "@/components/shared/SavedProvider";
import { CurrencyProvider } from "@/components/shared/CurrencyProvider";
import { CompareBar } from "@/components/shared/CompareBar";
import { getSettings } from "@/lib/settings";
import { getTranslations } from "@/lib/i18n";

/**
 * Public site shell: mode/locale-aware navigation + footer around every public
 * page. The Nav is a client component, so we resolve translations here and pass
 * plain serializable labels down.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, { t, locale }] = await Promise.all([
    getSettings(),
    getTranslations(),
  ]);

  const labels: NavLabels = {
    listings:
      settings.mode === "boutique" ? t("nav.collection") : t("nav.listings"),
    agents: t("nav.agents"),
    insights: t("nav.insights"),
    about: t("nav.about"),
    contact: t("nav.contact"),
    favorites: t("saved.favoritesLink"),
    savedSearches: t("savedSearch.title"),
    menu: t("nav.menu"),
    close: t("nav.close"),
    searchLocation: t("search.location"),
    searchType: t("search.type"),
    anyType: t("search.anyType"),
    search: t("search.search"),
  };

  const savedLabels: SavedLabels = {
    save: t("saved.save"),
    saved: t("saved.saved"),
    compare: t("saved.compare"),
    comparing: t("saved.comparing"),
    compareFull: t("saved.compareFull"),
    favoritesLink: t("saved.favoritesLink"),
    favoritesTitle: t("saved.favoritesTitle"),
    favoritesEyebrow: t("saved.favoritesEyebrow"),
    favoritesEmpty: t("saved.favoritesEmpty"),
    favoritesEmptyCta: t("saved.favoritesEmptyCta"),
    compareTitle: t("saved.compareTitle"),
    compareEyebrow: t("saved.compareEyebrow"),
    compareEmpty: t("saved.compareEmpty"),
    compareBarSelected: t("saved.compareBarSelected"),
    compareCta: t("saved.compareCta"),
    clear: t("saved.clear"),
    remove: t("saved.remove"),
    viewProperty: t("saved.viewProperty"),
    colPrice: t("saved.colPrice"),
    colLocation: t("saved.colLocation"),
    colType: t("saved.colType"),
    colBeds: t("saved.colBeds"),
    colBaths: t("saved.colBaths"),
    colArea: t("saved.colArea"),
    colFeatures: t("saved.colFeatures"),
  };

  return (
    <SmoothScroll>
      <ScrollFX />
      <CurrencyProvider>
        <SavedProvider labels={savedLabels}>
          <Nav
            logoText={settings.logoText}
            mode={settings.mode}
            locale={locale}
            locales={settings.locales}
            labels={labels}
          />
          <main className="min-h-screen">{children}</main>
          <CompareBar />
        </SavedProvider>
        <Footer />
      </CurrencyProvider>
    </SmoothScroll>
  );
}

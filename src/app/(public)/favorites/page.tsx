import type { Metadata } from "next";
import { FavoritesView } from "@/components/shared/FavoritesView";
import { getProperties } from "@/lib/queries";
import { getTranslations } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("saved.favoritesTitle") };
}

/**
 * Favorites page. Saved state lives client-side (localStorage), so we fetch the
 * full (small) property set on the server and let the client view filter to the
 * hearted ids. Shared across both modes.
 */
export default async function FavoritesPage() {
  const [properties, { t }] = await Promise.all([
    getProperties(),
    getTranslations(),
  ]);

  return (
    <FavoritesView properties={properties} featuredLabel={t("common.featured")} />
  );
}

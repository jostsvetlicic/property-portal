import type { Metadata } from "next";
import { SavedSearchesView } from "@/components/shared/SavedSearchesView";
import { getTranslations } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("savedSearch.title") };
}

/**
 * Saved searches page. Saved filter sets live client-side (localStorage), so
 * the server only supplies translated chrome and the client view hydrates the
 * list. Shared across both modes.
 */
export default async function SavedSearchesPage() {
  const { t } = await getTranslations();
  return (
    <SavedSearchesView
      labels={{
        title: t("savedSearch.title"),
        eyebrow: t("savedSearch.eyebrow"),
        empty: t("savedSearch.empty"),
        emptyCta: t("savedSearch.emptyCta"),
        open: t("savedSearch.open"),
        remove: t("savedSearch.remove"),
      }}
    />
  );
}

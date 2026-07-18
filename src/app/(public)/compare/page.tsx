import type { Metadata } from "next";
import { CompareView } from "@/components/shared/CompareView";
import { getProperties } from "@/lib/queries";
import { getTranslations } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("saved.compareTitle") };
}

/**
 * Compare page. The compared ids live client-side (localStorage); we fetch the
 * full (small) property set on the server and let the client view render the
 * selected 2–3 side by side. Shared across both modes.
 */
export default async function ComparePage() {
  const properties = await getProperties();
  return <CompareView properties={properties} />;
}

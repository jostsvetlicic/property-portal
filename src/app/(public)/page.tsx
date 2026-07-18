import { PortalHome } from "@/components/portal/PortalHome";
import { BoutiqueHome } from "@/components/boutique/BoutiqueHome";
import { getMode } from "@/lib/settings";

/**
 * Home route — a thin mode router. The effective mode (config default, or the
 * admin's DB override) decides which fully-designed experience renders.
 */
export default async function HomePage() {
  const mode = await getMode();
  return mode === "portal" ? <PortalHome /> : <BoutiqueHome />;
}

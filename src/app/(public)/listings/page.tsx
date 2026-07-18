import { PortalListings } from "@/components/portal/PortalListings";
import { BoutiqueListings } from "@/components/boutique/BoutiqueListings";
import { getMode } from "@/lib/settings";
import type { PropertyFilters } from "@/lib/queries";

/**
 * Listings route — mode router. Parses URL search params into typed filters
 * (shared by both modes) then renders the mode-appropriate experience.
 */
export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const mode = await getMode();

  const num = (v: string | string[] | undefined) => {
    const n = Number(Array.isArray(v) ? v[0] : v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const str = (v: string | string[] | undefined) =>
    (Array.isArray(v) ? v[0] : v) || undefined;
  const bool = (v: string | string[] | undefined) =>
    str(v) === "1" ? true : undefined;

  const filters: PropertyFilters & {
    condition?: string;
    energyRating?: string;
    parking?: boolean;
    elevator?: boolean;
    balcony?: boolean;
  } = {
    listingType: str(sp.listingType),
    location: str(sp.location),
    type: str(sp.type),
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    bedrooms: num(sp.bedrooms),
    bathrooms: num(sp.bathrooms),
    condition: str(sp.condition),
    energyRating: str(sp.energyRating),
    parking: bool(sp.parking),
    elevator: bool(sp.elevator),
    balcony: bool(sp.balcony),
    sort: str(sp.sort) as PropertyFilters["sort"],
  };

  return mode === "portal" ? (
    <PortalListings filters={filters} />
  ) : (
    <BoutiqueListings filters={filters} />
  );
}

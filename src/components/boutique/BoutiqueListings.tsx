import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CurrencyToggle } from "@/components/shared/CurrencyToggle";
import { PropertySearch } from "@/components/shared/PropertySearch";
import { CinematicCard } from "./CinematicCard";
import { BoutiqueResults } from "./BoutiqueResults";
import type { MapPin } from "@/components/shared/MapView";
import {
  getProperties,
  getLocations,
  type PropertyFilters,
} from "@/lib/queries";
import { getTranslations } from "@/lib/i18n";

/**
 * BOUTIQUE listings: the full curated collection as large editorial features.
 * Search is deliberately understated (minimal variant) — in boutique mode
 * beauty and brand lead — but still filters the full result set.
 */
export async function BoutiqueListings({
  filters,
}: {
  filters: PropertyFilters;
}) {
  const [properties, locations, { t }] = await Promise.all([
    getProperties(filters),
    getLocations(),
    getTranslations(),
  ]);

  const cardLabels = {
    view: t("property.viewProperty"),
    beds: t("property.bedrooms"),
    baths: t("property.bathrooms"),
    area: t("property.area"),
  };

  const pins: MapPin[] = properties
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      currency: p.currency,
      lat: p.lat as number,
      lng: p.lng as number,
    }));

  const initial = {
    location: filters.location ?? "",
    type: filters.type ?? "",
    minPrice: filters.minPrice ? String(filters.minPrice) : "",
    maxPrice: filters.maxPrice ? String(filters.maxPrice) : "",
    bedrooms: filters.bedrooms ? String(filters.bedrooms) : "",
    bathrooms: filters.bathrooms ? String(filters.bathrooms) : "",
  };

  return (
    <div className="pt-36">
      <Container className="pb-28">
        <SectionHeading
          align="center"
          eyebrow={t("hero.boutiqueEyebrow")}
          title={t("hero.boutiqueTitle")}
          subtitle={t("hero.boutiqueSubtitle")}
        />

        {/* Minimal, understated search */}
        <div className="mx-auto mt-12 max-w-4xl">
          <PropertySearch
            variant="minimal"
            locations={locations}
            initial={initial}
            labels={{
              location: t("search.location"),
              anyLocation: t("search.anyLocation"),
              type: t("search.type"),
              anyType: t("search.anyType"),
              minPrice: t("search.minPrice"),
              maxPrice: t("search.maxPrice"),
              bedrooms: t("search.bedrooms"),
              bathrooms: t("search.bathrooms"),
              any: t("search.any"),
              search: t("search.search"),
              buy: t("search.buy"),
              rent: t("search.rent"),
            }}
          />
          <div className="mt-6 flex justify-center">
            <CurrencyToggle />
          </div>
        </div>

        {properties.length === 0 ? (
          <p className="py-28 text-center text-cream/50">
            {t("search.noResults")}
          </p>
        ) : (
          <BoutiqueResults
            pins={pins}
            labels={{ collection: t("nav.collection"), map: t("property.location") }}
          >
            {properties.map((p, i) => (
              <CinematicCard
                key={p.id}
                property={p}
                index={i}
                labels={cardLabels}
              />
            ))}
          </BoutiqueResults>
        )}
      </Container>
    </div>
  );
}

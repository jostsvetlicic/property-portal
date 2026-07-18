import { Container } from "@/components/shared/Container";
import { CurrencyToggle } from "@/components/shared/CurrencyToggle";
import { ListingsBrowser, type SortValue } from "./ListingsBrowser";
import { getProperties, getLocations, type PropertyFilters } from "@/lib/queries";
import { getTranslations } from "@/lib/i18n";

/**
 * PORTAL listings: dense, filterable results with a grid ⇄ map toggle. The full
 * property set is fetched once and handed to ListingsBrowser, which filters and
 * sorts in-memory for instant results. Incoming URL params seed the initial view.
 */
export async function PortalListings({
  filters,
}: {
  filters: PropertyFilters & {
    condition?: string;
    energyRating?: string;
    parking?: boolean;
    elevator?: boolean;
    balcony?: boolean;
  };
}) {
  const [properties, locations, { t }] = await Promise.all([
    getProperties(),
    getLocations(),
    getTranslations(),
  ]);

  const initial = {
    listingType: filters.listingType ?? "",
    location: filters.location ?? "",
    type: filters.type ?? "",
    bedrooms: filters.bedrooms ? String(filters.bedrooms) : "",
    bathrooms: filters.bathrooms ? String(filters.bathrooms) : "",
    minPrice: filters.minPrice ? String(filters.minPrice) : "",
    maxPrice: filters.maxPrice ? String(filters.maxPrice) : "",
    condition: filters.condition ?? "",
    energyRating: filters.energyRating ?? "",
    parking: filters.parking ? "1" : "",
    elevator: filters.elevator ? "1" : "",
    balcony: filters.balcony ? "1" : "",
    sort: (filters.sort ?? "newest") as SortValue,
  };

  return (
    <div className="pt-28">
      <Container size="wide" className="pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-accent">{t("nav.listings")}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-4xl">
              {t("hero.portalTitle")}
            </h1>
          </div>
          <CurrencyToggle />
        </div>

        <ListingsBrowser
          properties={properties}
          locations={locations}
          initial={initial}
          featuredLabel={t("common.featured")}
          newLabel={t("common.new")}
          buyRentLabels={{ buy: t("search.buy"), rent: t("search.rent") }}
          saveSearchLabels={{
            save: t("savedSearch.save"),
            saved: t("savedSearch.saved"),
            namePlaceholder: t("savedSearch.namePlaceholder"),
            confirm: t("savedSearch.confirm"),
          }}
          filterLabels={{
            location: t("search.location"),
            anyLocation: t("search.anyLocation"),
            type: t("search.type"),
            anyType: t("search.anyType"),
            bedrooms: t("search.bedrooms"),
            bathrooms: t("search.bathrooms"),
            any: t("search.any"),
            minPrice: t("search.minPrice"),
            maxPrice: t("search.maxPrice"),
            condition: t("search.condition"),
            anyCondition: t("search.anyCondition"),
            energy: t("search.energy"),
            anyEnergy: t("search.anyEnergy"),
            parking: t("search.parking"),
            elevator: t("search.elevator"),
            balcony: t("search.balcony"),
            clear: t("search.clear"),
            filters: t("search.filters"),
          }}
          viewLabels={{
            grid: t("nav.listings"),
            map: t("property.location"),
            result: t("search.result"),
            results: t("search.results"),
            found: t("search.found"),
            noResultsTitle: t("search.noResultsTitle"),
            noResults: t("search.noResults"),
            clear: t("search.clear"),
            sort: t("search.sort"),
            sortNewest: t("search.sortNewest"),
            sortPriceAsc: t("search.sortPriceAsc"),
            sortPriceDesc: t("search.sortPriceDesc"),
            sortSize: t("search.sortSize"),
            sortPricePerM2: t("search.sortPricePerM2"),
            page: t("search.page"),
            of: t("search.of"),
            prev: t("search.prev"),
            next: t("search.next"),
          }}
        />
      </Container>
    </div>
  );
}

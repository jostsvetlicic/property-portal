import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { Testimonials } from "@/components/shared/Testimonials";
import { ButtonLink } from "@/components/shared/Button";
import { CinematicHero } from "./hero/CinematicHero";
import { CinematicCard } from "./CinematicCard";
import { BrandBand, FinalCta } from "@/components/portal/PortalHome";
import { getFeaturedProperties, getLocations, getStats } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { getTranslations } from "@/lib/i18n";
import { formatPriceCompact } from "@/lib/format";

/**
 * BOUTIQUE home: a curated, cinematic experience where BRAND is the hero. A
 * full-screen hero with a single elegant CTA (no search), a vertical showcase
 * of trophy properties as large editorial features, then brand + trust + CTA.
 */
export async function BoutiqueHome() {
  const [featured, locations, stats, settings, { t }] = await Promise.all([
    getFeaturedProperties(5),
    getLocations(),
    getStats(),
    getSettings(),
    getTranslations(),
  ]);

  const searchLabels = {
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
  };

  const cardLabels = {
    view: t("property.viewProperty"),
    beds: t("property.bedrooms"),
    baths: t("property.bathrooms"),
    area: t("property.area"),
  };

  const heroImage =
    featured[0]?.images[0]?.url ??
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80";

  return (
    <>
      {/* Static cinematic hero: full-bleed property image + parallax + fade-up. */}
      <CinematicHero
        eyebrow={t("hero.boutiqueEyebrow")}
        title={t("hero.boutiqueTitle")}
        subtitle={t("hero.boutiqueSubtitle")}
        image={heroImage}
        locations={locations}
        searchLabels={searchLabels}
      />

      {/* Curated showcase */}
      <section className="py-28">
        <Container>
          <SectionHeading
            align="center"
            eyebrow={t("hero.boutiqueEyebrow")}
            title={t("brand.sectionTitle")}
            subtitle={t("brand.sectionBody")}
          />
          <div className="mt-24 space-y-28">
            {featured.map((p, i) => (
              <CinematicCard
                key={p.id}
                property={p}
                index={i}
                labels={cardLabels}
              />
            ))}
          </div>

          <div className="mt-24 text-center">
            <ButtonLink href="/listings" variant="outline" className="text-cream">
              {t("common.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Brand band */}
      <BrandBand
        title={settings.name}
        body={t("brand.sectionBody")}
        cta={t("common.readMore")}
        image={
          featured[1]?.images[0]?.url ??
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        }
      />

      {/* Trust */}
      <TrustStrip
        asSeenInLabel={t("brand.asSeenIn")}
        stats={[
          { value: `${stats.propertyCount}`, label: t("brand.statsProperties") },
          { value: "3", label: t("brand.statsCountries") },
          {
            value: `${formatPriceCompact(stats.totalValue)}`,
            label: t("brand.statsValue"),
          },
          { value: "20+", label: t("brand.statsYears") },
        ]}
      />

      {/* Testimonials */}
      <Testimonials
        eyebrow={t("testimonials.eyebrow")}
        title={t("testimonials.title")}
        subtitle={t("testimonials.subtitle")}
      />

      {/* CTA */}
      <FinalCta
        title={t("brand.ctaTitle")}
        body={t("brand.ctaBody")}
        button={t("brand.ctaButton")}
      />
    </>
  );
}

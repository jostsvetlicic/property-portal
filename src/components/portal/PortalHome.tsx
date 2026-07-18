import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { Testimonials } from "@/components/shared/Testimonials";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/shared/Button";
import { PropertySearch } from "@/components/shared/PropertySearch";
import { RecentlyViewed } from "@/components/shared/RecentlyViewed";
import {
  getFeaturedProperties,
  getLocations,
  getStats,
  getProperties,
} from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { getTranslations } from "@/lib/i18n";
import { formatPriceCompact } from "@/lib/format";

/**
 * PORTAL home: a marketplace-style landing where SEARCH is the hero. Big hero
 * image, prominent search bar, dense featured grid, brand + trust sections.
 */
export async function PortalHome() {
  const [featured, allProperties, locations, stats, settings, { t }] =
    await Promise.all([
      getFeaturedProperties(6),
      getProperties(),
      getLocations(),
      getStats(),
      getSettings(),
      getTranslations(),
    ]);

  const heroImage =
    featured[0]?.images[0]?.url ??
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80";

  return (
    <>
      {/* HERO with search */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            data-parallax
            data-parallax-speed="1"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-base/70 via-base/40 to-base" />
        </div>

        <Container className="relative z-10 pt-24">
          <div className="max-w-3xl">
            <p className="eyebrow text-accent">{settings.name}</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
              {t("hero.portalTitle")}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/70">
              {t("hero.portalSubtitle")}
            </p>
          </div>
          <div className="mt-10 max-w-4xl">
            <PropertySearch
              variant="hero"
              locations={locations}
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
          </div>
        </Container>
      </section>

      {/* FEATURED grid */}
      <section className="py-24">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t("common.featured")}
              title={t("brand.sectionTitle")}
            />
            <ButtonLink
              href="/listings"
              variant="outline"
              className="hidden shrink-0 text-cream sm:inline-flex"
            >
              {t("common.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}>
                <PropertyCard
                  property={p}
                  featuredLabel={t("common.featured")}
                  newLabel={t("common.new")}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* RECENTLY VIEWED */}
      <RecentlyViewed
        properties={allProperties}
        title={t("recent.title")}
        subtitle={t("recent.subtitle")}
        featuredLabel={t("common.featured")}
        newLabel={t("common.new")}
      />

      {/* BRAND band */}
      <BrandBand
        title={t("brand.sectionTitle")}
        body={t("brand.sectionBody")}
        cta={t("common.viewAll")}
        image={
          featured[1]?.images[0]?.url ??
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        }
      />

      {/* TRUST */}
      <TrustStrip
        asSeenInLabel={t("brand.asSeenIn")}
        stats={[
          {
            value: `${stats.propertyCount}+`,
            label: t("brand.statsProperties"),
          },
          { value: "2", label: t("brand.statsCountries") },
          {
            value: `${formatPriceCompact(stats.totalValue)}`,
            label: t("brand.statsValue"),
          },
          { value: "20+", label: t("brand.statsYears") },
        ]}
      />

      {/* TESTIMONIALS */}
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

export function BrandBand({
  title,
  body,
  cta,
  image,
}: {
  title: string;
  body: string;
  cta: string;
  image: string;
}) {
  return (
    <section className="py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal
            fx="clip"
            className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-base)]"
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              data-parallax
              data-parallax-speed="0.6"
              className="object-cover"
            />
          </Reveal>
          <Reveal fx="left" delay={120}>
            <p className="eyebrow text-accent">{title}</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-cream sm:text-4xl">
              {body}
            </h2>
            <div className="mt-8">
              <ButtonLink href="/about" variant="primary">
                {cta}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function FinalCta({
  title,
  body,
  button,
}: {
  title: string;
  body: string;
  button: string;
}) {
  return (
    <section className="py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[var(--radius-base)] bg-charcoal px-8 py-20 text-center ring-1 ring-cream/10">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl text-cream sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/60">{body}</p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-base transition hover:bg-accent-soft"
              >
                {button}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

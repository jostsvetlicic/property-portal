import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Gallery } from "@/components/shared/Gallery";
import { Reveal } from "@/components/shared/Reveal";
import { formatPrice, parseFeatures } from "@/lib/format";
import {
  SpecGrid,
  FeaturesList,
  LocationMap,
  AgentInquiry,
  type DetailLabels,
} from "@/components/shared/PropertyDetailParts";
import { MortgageCalculator } from "@/components/shared/MortgageCalculator";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { SaveControls } from "@/components/shared/SaveControls";
import { VirtualTour } from "@/components/shared/VirtualTour";
import { SimilarProperties } from "@/components/shared/SimilarProperties";
import type { PropertyWithRelations } from "@/lib/queries";
import type { DetailExtras } from "@/app/(public)/properties/[slug]/page";

/**
 * BOUTIQUE property detail: immersive scroll storytelling. A full-bleed
 * cinematic hero, an evocative narrative set BEFORE the specs, then a
 * secondary full-width image, the gallery, specs, features, map and inquiry.
 */
export function BoutiqueDetail({
  property,
  labels,
  backLabel,
  overviewLabel,
  extras,
}: {
  property: PropertyWithRelations;
  labels: DetailLabels;
  backLabel: string;
  overviewLabel: string;
  extras: DetailExtras;
}) {
  const features = parseFeatures(property.features);
  const hero = property.images[0]?.url;
  const secondary = property.images[2]?.url ?? property.images[1]?.url;

  return (
    <article>
      {/* Cinematic hero */}
      <section className="relative flex h-screen items-end overflow-hidden">
        {hero && (
          <Image
            src={hero}
            alt={property.title}
            fill
            priority
            sizes="100vw"
            data-parallax
            data-parallax-speed="1"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-base/40" />
        <Container className="relative z-10 pb-20">
          <Link
            href="/listings"
            className="mb-8 inline-flex items-center gap-2 text-sm text-cream/70 transition hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          <p className="eyebrow text-accent">
            {property.type} · {property.location}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-light leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
            {property.title}
          </h1>
          <p className="mt-6 font-display text-2xl text-accent">
            {formatPrice(property.price, property.currency)}
          </p>
        </Container>
      </section>

      {/* Evocative narrative — BEFORE the specs (boutique storytelling) */}
      {property.narrative && (
        <section className="py-28">
          <Container size="narrow">
            <Reveal className="text-center">
              <p className="eyebrow mb-8 text-accent">{overviewLabel}</p>
              <p className="font-display text-3xl font-light leading-[1.4] text-cream/90 sm:text-4xl">
                {property.narrative}
              </p>
            </Reveal>
          </Container>
        </section>
      )}

      {/* Secondary full-width image — true scroll parallax */}
      {secondary && (
        <section className="relative h-[70vh] overflow-hidden">
          <Image
            src={secondary}
            alt=""
            fill
            sizes="100vw"
            data-parallax
            data-parallax-speed="1.2"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-base/10" />
        </section>
      )}

      {/* Description + specs */}
      <section className="py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-3">
            <div className="space-y-16 lg:col-span-2">
              <Reveal>
                <SpecGrid property={property} labels={labels} />
              </Reveal>
              <Reveal>
                <p className="whitespace-pre-line text-xl leading-relaxed text-cream/75">
                  {property.description}
                </p>
              </Reveal>
              <Reveal>
                <FeaturesList features={features} title={labels.features} />
              </Reveal>
              <Reveal>
                <div className="flex flex-wrap items-center gap-6">
                  <SaveControls propertyId={property.id} variant="inline" />
                  <ShareButtons title={property.title} labels={extras.share} />
                </div>
              </Reveal>
            </div>

            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28">
                <AgentInquiry property={property} labels={labels} />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Virtual tour */}
      {property.videoUrl && (
        <section className="pb-24">
          <Container>
            <Reveal>
              <VirtualTour
                url={property.videoUrl}
                title={extras.virtualTourLabel}
              />
            </Reveal>
          </Container>
        </section>
      )}

      {/* Gallery */}
      <section className="pb-20">
        <Container>
          <Reveal>
            <Gallery images={property.images} />
          </Reveal>
        </Container>
      </section>

      {/* Mortgage calculator */}
      <section className="pb-24">
        <Container size="narrow">
          <Reveal>
            <MortgageCalculator
              price={property.price}
              currency={property.currency}
              labels={extras.mortgage}
            />
          </Reveal>
        </Container>
      </section>

      {/* Location */}
      <section className="pb-28">
        <Container>
          <Reveal>
            <LocationMap property={property} title={labels.location} />
          </Reveal>
        </Container>
      </section>

      {/* Similar properties */}
      {extras.similar.length > 0 && (
        <section className="border-t border-cream/10 bg-charcoal/30 py-28">
          <Container>
            <Reveal>
              <SimilarProperties
                properties={extras.similar}
                title={extras.similarLabel}
                featuredLabel={extras.featuredLabel}
              />
            </Reveal>
          </Container>
        </section>
      )}
    </article>
  );
}

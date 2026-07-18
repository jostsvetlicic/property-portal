import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Gallery } from "@/components/shared/Gallery";
import {
  SpecGrid,
  SpecTable,
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
import { RecentlyViewedTracker } from "@/components/shared/RecentlyViewedTracker";
import { parseFeatures } from "@/lib/format";
import type { PropertyWithRelations } from "@/lib/queries";
import type { DetailExtras } from "@/app/(public)/properties/[slug]/page";

/**
 * PORTAL property detail: efficient, information-first layout — gallery on top,
 * two-column body with a sticky inquiry sidebar.
 */
export function PortalDetail({
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

  return (
    <div className="pt-28">
      <RecentlyViewedTracker slug={property.slug} />
      <Container className="pb-24">
        <Link
          href="/listings"
          className="mb-6 inline-flex items-center gap-2 text-sm text-cream/60 transition hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-accent">
            {(property.listingType === "rent"
              ? labels.forRent
              : labels.forSale) +
              " · " +
              property.type +
              " · " +
              property.location}
          </p>
          <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl">
            {property.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <SaveControls propertyId={property.id} variant="inline" />
            <ShareButtons title={property.title} labels={extras.share} />
            <Link
              href={`/print/${property.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-cream/60 transition hover:text-accent"
            >
              <Printer className="h-4 w-4" />
              {extras.printSheetLabel}
            </Link>
          </div>
        </div>

        <Gallery images={property.images} />

        <div className="mt-14 grid gap-12 lg:grid-cols-3">
          <div className="space-y-14 lg:col-span-2">
            <SpecGrid property={property} labels={labels} />

            <div>
              <h2 className="font-display text-2xl text-cream">
                {overviewLabel}
              </h2>
              <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-cream/70">
                {property.description}
              </p>
            </div>

            <SpecTable
              property={property}
              labels={labels}
              title={extras.specsLabel}
            />

            <FeaturesList features={features} title={labels.features} />
            <VirtualTour
              url={property.videoUrl}
              title={extras.virtualTourLabel}
            />
            <MortgageCalculator
              price={property.price}
              currency={property.currency}
              labels={extras.mortgage}
            />
            <LocationMap property={property} title={labels.location} />
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              <AgentInquiry property={property} labels={labels} />
            </div>
          </aside>
        </div>
      </Container>

      {extras.similar.length > 0 && (
        <div className="border-t border-cream/10 bg-charcoal/30 py-24">
          <Container>
            <SimilarProperties
              properties={extras.similar}
              title={extras.similarLabel}
              featuredLabel={extras.featuredLabel}
            />
          </Container>
        </div>
      )}
    </div>
  );
}

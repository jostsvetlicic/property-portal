import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BedDouble, Bath, Maximize } from "lucide-react";
import { Price } from "@/components/shared/Price";
import { Reveal } from "@/components/shared/Reveal";
import { SaveControls } from "@/components/shared/SaveControls";
import type { PropertyWithRelations } from "@/lib/queries";

/**
 * Large, editorial, full-width property feature used in boutique mode. Images
 * alternate sides; generous whitespace; the property is the hero.
 */
export function CinematicCard({
  property,
  index,
  labels,
}: {
  property: PropertyWithRelations;
  index: number;
  labels: { view: string; beds: string; baths: string; area: string };
}) {
  const cover = property.images[0]?.url;
  const flipped = index % 2 === 1;

  return (
    <Reveal>
      <Link
        href={`/properties/${property.slug}`}
        className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
      >
        {/* Image — arched frame (Village Properties reference) with a cinematic
            clip-path wipe reveal (and hover zoom via .img-zoom). */}
        <div className={flipped ? "lg:order-2" : ""}>
          <div
            data-fx="clip"
            className="img-zoom relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[var(--radius-base)] bg-charcoal sm:aspect-[3/4]"
          >
            {cover && (
              <Image
                src={cover}
                alt={property.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            )}
            <SaveControls
              propertyId={property.id}
              positionClass="bottom-5 right-5"
            />
          </div>
        </div>

        {/* Copy */}
        <div className={flipped ? "lg:order-1 lg:pr-10" : "lg:pl-10"}>
          <p className="eyebrow text-accent">
            {property.type} · {property.location}
          </p>
          <h3 className="mt-4 font-display text-4xl leading-tight text-cream transition-colors group-hover:text-accent sm:text-5xl">
            {property.title}
          </h3>
          {property.narrative && (
            <p className="mt-5 max-w-md text-base italic leading-relaxed text-cream/60">
              “{property.narrative}”
            </p>
          )}

          <div className="mt-8 flex items-center gap-8 text-sm text-cream/70">
            <span className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-accent" /> {property.bedrooms}{" "}
              {labels.beds}
            </span>
            <span className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-accent" /> {property.bathrooms}{" "}
              {labels.baths}
            </span>
            <span className="flex items-center gap-2">
              <Maximize className="h-4 w-4 text-accent" /> {property.area} m²
            </span>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <Price
              amount={property.price}
              base={property.currency}
              className="font-display text-2xl text-accent"
            />
            <span className="inline-flex items-center gap-1.5 text-sm tracking-wide text-cream transition-all group-hover:gap-3 group-hover:text-accent">
              {labels.view}
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

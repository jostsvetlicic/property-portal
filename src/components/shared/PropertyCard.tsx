import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize } from "lucide-react";
import { Price, PricePerM2 } from "./Price";
import { SaveControls } from "./SaveControls";
import type { PropertyWithRelations } from "@/lib/queries";

/** A listing is flagged "New" for this many days after it is created. */
const NEW_DAYS = 21;

function isNew(createdAt: Date | string): boolean {
  const created = new Date(createdAt).getTime();
  return Date.now() - created < NEW_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Portal-mode listing card: a compact, information-dense card built for volume.
 * Shows photo, price (with /mo for rentals), price per m², location, key specs,
 * the listing reference and a "New" badge on recent listings.
 */
export function PropertyCard({
  property,
  featuredLabel,
  newLabel = "New",
}: {
  property: PropertyWithRelations;
  featuredLabel?: string;
  newLabel?: string;
}) {
  const cover = property.images[0]?.url;
  const statusColors: Record<string, string> = {
    reserved: "bg-amber-500/90 text-base",
    sold: "bg-red-800/90 text-cream",
  };
  const isRent = property.listingType === "rent";

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-base)] bg-charcoal ring-1 ring-cream/10 transition-all duration-300 hover:ring-accent/50 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="img-zoom relative aspect-[4/3] w-full overflow-hidden">
        {cover && (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <SaveControls propertyId={property.id} />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded bg-base/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-accent backdrop-blur-sm">
            {isRent ? "For rent" : "For sale"}
          </span>
          {isNew(property.createdAt) && (
            <span className="rounded bg-emerald-500/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-base">
              {newLabel}
            </span>
          )}
          {property.featured && featuredLabel && (
            <span className="rounded bg-accent px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-base">
              {featuredLabel}
            </span>
          )}
          {property.status !== "available" && (
            <span
              className={`rounded px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider ${
                statusColors[property.status] ?? "bg-cream/90 text-base"
              }`}
            >
              {property.status}
            </span>
          )}
        </div>

        {/* Price block */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="rounded bg-base/80 px-2.5 py-1 font-display text-lg font-semibold text-cream backdrop-blur-sm">
            <Price
              amount={property.price}
              base={property.currency}
              listingType={property.listingType}
            />
          </span>
          {!isRent && property.area > 0 && (
            <span className="rounded bg-base/70 px-2 py-1 text-[0.7rem] text-cream/80 backdrop-blur-sm">
              <PricePerM2 price={property.price} area={property.area} base={property.currency} />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold leading-snug text-cream transition-colors group-hover:text-accent">
            {property.title}
          </h3>
          <span className="shrink-0 whitespace-nowrap pt-0.5 text-[0.65rem] uppercase tracking-wider text-cream/35">
            {property.reference}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-cream/55">{property.location}</p>

        <div className="mt-auto flex items-center gap-4 pt-4 text-sm text-cream/70">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-accent" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-accent" />
              {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-accent" />
            {property.area} m²
          </span>
        </div>
      </div>
    </Link>
  );
}

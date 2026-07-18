import { BedDouble, Bath, Maximize, Home, Check, MapPin } from "lucide-react";
import { MapViewDynamic } from "./MapViewDynamic";
import { InquiryForm, type InquiryLabels } from "./InquiryForm";
import { AgentCard } from "./AgentCard";
import { formatArea, formatPrice, formatPricePerM2 } from "@/lib/format";
import type { PropertyWithRelations } from "@/lib/queries";
import type { MapPin as Pin } from "./MapView";

export interface DetailLabels {
  bedrooms: string;
  bathrooms: string;
  area: string;
  type: string;
  features: string;
  location: string;
  yourAgent: string;
  reference: string;
  listingType: string;
  forSale: string;
  forRent: string;
  pricePerM2: string;
  yearBuilt: string;
  floor: string;
  floorOf: string;
  condition: string;
  energyRating: string;
  landSize: string;
  parking: string;
  elevator: string;
  balcony: string;
  yes: string;
  no: string;
  perMonth: string;
  inquiry: InquiryLabels;
}

/** Key spec tiles (beds / baths / area / type). Beds/baths hidden when 0. */
export function SpecGrid({
  property,
  labels,
}: {
  property: PropertyWithRelations;
  labels: DetailLabels;
}) {
  const specs = [
    property.bedrooms > 0 && {
      icon: BedDouble,
      value: property.bedrooms,
      label: labels.bedrooms,
    },
    property.bathrooms > 0 && {
      icon: Bath,
      value: property.bathrooms,
      label: labels.bathrooms,
    },
    { icon: Maximize, value: formatArea(property.area), label: labels.area },
    { icon: Home, value: property.type, label: labels.type },
  ].filter(Boolean) as { icon: typeof Home; value: React.ReactNode; label: string }[];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {specs.map((s) => (
        <div
          key={s.label}
          className="rounded-[var(--radius-base)] border border-cream/10 bg-cream/[0.03] p-5 text-center"
        >
          <s.icon className="mx-auto h-6 w-6 text-accent" />
          <div className="mt-3 font-display text-xl text-cream">{s.value}</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-cream/45">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Detailed specification table: reference, all the new marketplace fields. */
export function SpecTable({
  property,
  labels,
  title,
}: {
  property: PropertyWithRelations;
  labels: DetailLabels;
  title: string;
}) {
  const yn = (v: boolean) => (v ? labels.yes : labels.no);
  const perM2 = formatPricePerM2(property.price, property.area, property.currency);

  const rows: [string, React.ReactNode][] = [
    [labels.reference, property.reference],
    [
      labels.listingType,
      property.listingType === "rent" ? labels.forRent : labels.forSale,
    ],
    [labels.type, property.type],
  ];
  if (property.listingType === "sale" && perM2) rows.push([labels.pricePerM2, perM2]);
  rows.push([labels.area, formatArea(property.area)]);
  if (property.landSize)
    rows.push([labels.landSize, formatArea(property.landSize)]);
  if (property.yearBuilt) rows.push([labels.yearBuilt, property.yearBuilt]);
  if (property.floor != null)
    rows.push([
      labels.floor,
      property.totalFloors
        ? `${property.floor} ${labels.floorOf} ${property.totalFloors}`
        : String(property.floor),
    ]);
  if (property.condition) rows.push([labels.condition, property.condition]);
  if (property.energyRating)
    rows.push([labels.energyRating, property.energyRating]);
  rows.push([labels.parking, yn(property.parking)]);
  rows.push([labels.elevator, yn(property.elevator)]);
  rows.push([labels.balcony, yn(property.balcony)]);

  return (
    <div>
      <h2 className="font-display text-2xl text-cream">{title}</h2>
      <dl className="mt-6 grid gap-x-8 gap-y-0 sm:grid-cols-2">
        {rows.map(([label, value], i) => (
          <div
            key={`${label}-${i}`}
            className="flex items-center justify-between gap-4 border-b border-cream/10 py-3"
          >
            <dt className="text-sm text-cream/50">{label}</dt>
            <dd className="text-sm font-medium text-cream">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Amenities / features checklist. */
export function FeaturesList({
  features,
  title,
}: {
  features: string[];
  title: string;
}) {
  if (features.length === 0) return null;
  return (
    <div>
      <h2 className="font-display text-2xl text-cream">{title}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-cream/75">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15">
              <Check className="h-3.5 w-3.5 text-accent" />
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Location block with a single-pin Leaflet map. */
export function LocationMap({
  property,
  title,
}: {
  property: PropertyWithRelations;
  title: string;
}) {
  if (property.lat == null || property.lng == null) return null;
  const pin: Pin = {
    id: property.id,
    slug: property.slug,
    title: property.title,
    price: property.price,
    currency: property.currency,
    lat: property.lat,
    lng: property.lng,
  };
  return (
    <div>
      <h2 className="font-display text-2xl text-cream">{title}</h2>
      <p className="mt-2 flex items-center gap-2 text-sm text-cream/55">
        <MapPin className="h-4 w-4 text-accent" />
        {property.location}
      </p>
      <div className="mt-6 h-[380px] overflow-hidden rounded-[var(--radius-base)] ring-1 ring-cream/10">
        <MapViewDynamic pins={[pin]} zoom={12} className="h-full w-full" />
      </div>
    </div>
  );
}

/** Sticky sidebar: price, agent, inquiry form. */
export function AgentInquiry({
  property,
  labels,
}: {
  property: PropertyWithRelations;
  labels: DetailLabels;
}) {
  return (
    <div className="space-y-6 rounded-[var(--radius-base)] border border-cream/10 bg-charcoal/60 p-6">
      <div>
        <div className="font-display text-3xl text-accent">
          {formatPrice(property.price, property.currency)}
          {property.listingType === "rent" && (
            <span className="text-lg text-cream/50">{labels.perMonth}</span>
          )}
        </div>
        {property.listingType === "sale" &&
          formatPricePerM2(property.price, property.area, property.currency) && (
            <p className="mt-1 text-sm text-cream/55">
              {formatPricePerM2(
                property.price,
                property.area,
                property.currency,
              )}
            </p>
          )}
        <p className="mt-1 text-xs uppercase tracking-widest text-cream/40">
          {labels.reference}: {property.reference}
        </p>
      </div>

      {property.agent && (
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-cream/45">
            {labels.yourAgent}
          </p>
          <AgentCard agent={property.agent} variant="compact" />
        </div>
      )}

      <div className="rule" />

      <InquiryForm
        labels={labels.inquiry}
        propertyId={property.id}
        source="property"
        compact
      />
    </div>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPropertyBySlug } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { getTranslations } from "@/lib/i18n";
import {
  formatPrice,
  formatArea,
  formatPricePerM2,
  parseFeatures,
} from "@/lib/format";
import { AutoPrint } from "@/components/shared/AutoPrint";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Print-friendly listing sheet — a clean, light, single-page document an agent
 * can print or save as PDF to hand to a client. It lives OUTSIDE the (public)
 * route group so it does not inherit the dark site nav/footer: it renders its
 * own white A4-style layout and opens the print dialog automatically.
 */
export default async function PrintSheetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [property, settings, { t }] = await Promise.all([
    getPropertyBySlug(slug),
    getSettings(),
    getTranslations(),
  ]);

  if (!property) notFound();

  const features = parseFeatures(property.features);
  const perM2 = formatPricePerM2(property.price, property.area, property.currency);
  const priceLabel =
    formatPrice(property.price, property.currency) +
    (property.listingType === "rent" ? t("property.perMonth") : "");

  const yn = (v: boolean) => (v ? t("property.yes") : t("property.no"));

  const rows: [string, string | number][] = [
    [t("property.reference"), property.reference],
    [
      t("property.listingType"),
      property.listingType === "rent"
        ? t("property.forRent")
        : t("property.forSale"),
    ],
    [t("property.type"), property.type],
    [t("property.area"), formatArea(property.area)],
  ];
  if (property.listingType === "sale" && perM2)
    rows.push([t("property.pricePerM2"), perM2]);
  if (property.bedrooms > 0)
    rows.push([t("property.bedrooms"), property.bedrooms]);
  if (property.bathrooms > 0)
    rows.push([t("property.bathrooms"), property.bathrooms]);
  if (property.landSize)
    rows.push([t("property.landSize"), formatArea(property.landSize)]);
  if (property.yearBuilt)
    rows.push([t("property.yearBuilt"), property.yearBuilt]);
  if (property.floor != null)
    rows.push([
      t("property.floor"),
      property.totalFloors
        ? `${property.floor} ${t("property.floorOf")} ${property.totalFloors}`
        : property.floor,
    ]);
  if (property.condition)
    rows.push([t("property.condition"), property.condition]);
  if (property.energyRating)
    rows.push([t("property.energyRating"), property.energyRating]);
  rows.push([t("property.parking"), yn(property.parking)]);
  rows.push([t("property.elevator"), yn(property.elevator)]);
  rows.push([t("property.balcony"), yn(property.balcony)]);

  const cover = property.images[0]?.url;
  const gallery = property.images.slice(1, 4);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <AutoPrint />
      <div className="mx-auto max-w-4xl px-10 py-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-4">
          <div>
            <p className="text-lg font-bold tracking-widest">
              {settings.logoText}
            </p>
            <p className="text-xs text-neutral-500">{settings.tagline}</p>
          </div>
          <div className="text-right text-xs text-neutral-600">
            <p>{settings.contact.phone}</p>
            <p>{settings.contact.email}</p>
          </div>
        </div>

        {/* Title + price */}
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <p className="mt-1 text-sm text-neutral-600">{property.location}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{priceLabel}</p>
            {property.listingType === "sale" && perM2 && (
              <p className="text-sm text-neutral-500">{perM2}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              {t("property.reference")}: {property.reference}
            </p>
          </div>
        </div>

        {/* Cover image */}
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={property.title}
            className="mt-6 h-80 w-full rounded object-cover"
          />
        )}

        {/* Gallery thumbnails */}
        {gallery.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {gallery.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.url}
                src={img.url}
                alt={property.title}
                className="h-28 w-full rounded object-cover"
              />
            ))}
          </div>
        )}

        {/* Specs */}
        <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-neutral-500">
          {t("property.specifications")}
        </h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-10">
          {rows.map(([label, value], i) => (
            <div
              key={`${label}-${i}`}
              className="flex justify-between border-b border-neutral-200 py-1.5 text-sm"
            >
              <dt className="text-neutral-500">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Description */}
        <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-neutral-500">
          {t("property.overview")}
        </h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
          {property.description}
        </p>

        {/* Features */}
        {features.length > 0 && (
          <>
            <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-neutral-500">
              {t("property.features")}
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-10 gap-y-1 text-sm text-neutral-700">
              {features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </>
        )}

        {/* Agent */}
        {property.agent && (
          <div className="mt-8 border-t border-neutral-300 pt-4 text-sm">
            <p className="font-bold">{t("property.yourAgent")}</p>
            <p className="mt-1">
              {property.agent.name}
              {property.agent.role ? ` — ${property.agent.role}` : ""}
            </p>
            <p className="text-neutral-600">
              {property.agent.phone ? `${property.agent.phone} · ` : ""}
              {property.agent.email}
            </p>
          </div>
        )}

        <p className="mt-10 text-center text-[10px] text-neutral-400">
          {settings.name} · {settings.contact.address}
        </p>
      </div>
    </div>
  );
}

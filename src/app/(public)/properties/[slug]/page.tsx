import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortalDetail } from "@/components/portal/PortalDetail";
import { BoutiqueDetail } from "@/components/boutique/BoutiqueDetail";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { getMode } from "@/lib/settings";
import { getTranslations } from "@/lib/i18n";
import type { DetailLabels } from "@/components/shared/PropertyDetailParts";
import type { MortgageLabels } from "@/components/shared/MortgageCalculator";
import type { ShareLabels } from "@/components/shared/ShareButtons";

/** Extra sections shared by both detail modes (mortgage, share, tour, similar). */
export interface DetailExtras {
  similar: import("@/lib/queries").PropertyWithRelations[];
  similarLabel: string;
  virtualTourLabel: string;
  featuredLabel: string;
  specsLabel: string;
  printSheetLabel: string;
  mortgage: MortgageLabels;
  share: ShareLabels;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Not found" };

  // Admin-authored SEO overrides win; otherwise derive sensible defaults.
  const title = property.metaTitle?.trim() || property.title;
  const description =
    property.metaDescription?.trim() || property.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: property.images[0]?.url ? [property.images[0].url] : [],
    },
  };
}

/**
 * Property detail — mode router. Shared data fetch; portal renders an
 * information-first layout, boutique renders immersive scroll storytelling.
 */
export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [property, mode, { t }] = await Promise.all([
    getPropertyBySlug(slug),
    getMode(),
    getTranslations(),
  ]);

  if (!property) notFound();

  // Fire-and-forget view counter for the admin "most-viewed" stat.
  void prisma.property
    .update({ where: { id: property.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const similar = await getSimilarProperties(property, 3);

  const labels: DetailLabels = {
    bedrooms: t("property.bedrooms"),
    bathrooms: t("property.bathrooms"),
    area: t("property.area"),
    type: t("property.type"),
    features: t("property.features"),
    location: t("property.location"),
    yourAgent: t("property.yourAgent"),
    reference: t("property.reference"),
    listingType: t("property.listingType"),
    forSale: t("property.forSale"),
    forRent: t("property.forRent"),
    pricePerM2: t("property.pricePerM2"),
    yearBuilt: t("property.yearBuilt"),
    floor: t("property.floor"),
    floorOf: t("property.floorOf"),
    condition: t("property.condition"),
    energyRating: t("property.energyRating"),
    landSize: t("property.landSize"),
    parking: t("property.parking"),
    elevator: t("property.elevator"),
    balcony: t("property.balcony"),
    yes: t("property.yes"),
    no: t("property.no"),
    perMonth: t("property.perMonth"),
    inquiry: {
      title: t("inquiry.title"),
      subtitle: t("inquiry.subtitle"),
      name: t("inquiry.name"),
      email: t("inquiry.email"),
      phone: t("inquiry.phone"),
      message: t("inquiry.message"),
      messagePlaceholder: t("inquiry.messagePlaceholder"),
      submit: t("inquiry.submit"),
      sending: t("inquiry.sending"),
      success: t("inquiry.success"),
      error: t("inquiry.error"),
    },
  };

  const backLabel = t("property.backToListings");
  const overviewLabel = t("property.overview");

  const extras: DetailExtras = {
    similar,
    similarLabel: t("property.similar"),
    virtualTourLabel: t("property.virtualTour"),
    featuredLabel: t("common.featured"),
    specsLabel: t("property.specifications"),
    printSheetLabel: t("property.printSheet"),
    mortgage: {
      title: t("property.mortgageTitle"),
      price: t("property.mortgagePrice"),
      downPayment: t("property.mortgageDownPayment"),
      interest: t("property.mortgageInterest"),
      term: t("property.mortgageTerm"),
      years: t("property.mortgageYears"),
      monthly: t("property.mortgageMonthly"),
      loan: t("property.mortgageLoan"),
      disclaimer: t("property.mortgageDisclaimer"),
    },
    share: {
      share: t("property.share"),
      whatsapp: t("property.shareWhatsapp"),
      email: t("property.shareEmail"),
      copy: t("property.shareCopy"),
      copied: t("property.shareCopied"),
    },
  };

  return mode === "portal" ? (
    <PortalDetail
      property={property}
      labels={labels}
      backLabel={backLabel}
      overviewLabel={overviewLabel}
      extras={extras}
    />
  ) : (
    <BoutiqueDetail
      property={property}
      labels={labels}
      backLabel={backLabel}
      overviewLabel={overviewLabel}
      extras={extras}
    />
  );
}

/**
 * Market Insights / Blog content.
 *
 * Editorial articles are curated content (like property descriptions) and live
 * here as a typed, static dataset — no CMS or DB table needed. Each article is
 * SEO-friendly: a stable slug, meta title/description, cover image, tag, read
 * time and publish date, plus body paragraphs. Swap these for the agency's real
 * articles per clone.
 */

export interface InsightArticle {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  cover: string;
  author: string;
  date: string; // ISO date
  readMinutes: number;
  body: string[];
}

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    slug: "adriatic-luxury-market-outlook-2026",
    title: "Adriatic Luxury Market Outlook 2026",
    excerpt:
      "Prime coastal values along the Adriatic continue their measured climb. We break down where demand is concentrating and what it means for buyers and sellers.",
    metaDescription:
      "Our 2026 outlook for the Adriatic luxury property market: pricing trends, buyer demand, and the coastal locations to watch.",
    category: "Market Reports",
    cover:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    author: "Adriatic Estates Research",
    date: "2026-01-14",
    readMinutes: 6,
    body: [
      "The Adriatic coast has quietly become one of Europe's most resilient luxury property markets. Where Mediterranean rivals have seen volatility, the stretch from Istria to the Bay of Kotor has delivered steady, single-digit annual appreciation for trophy assets — a pattern we expect to continue through 2026.",
      "Three forces underpin this stability. First, genuine scarcity: waterfront land with building permission is finite, and heritage-protected old towns cannot expand. Second, an international buyer base that is broadening beyond traditional Central European markets to include buyers from the Gulf, the UK, and North America. Third, infrastructure — new marinas, upgraded airports, and improved coastal roads — that keeps widening the pool of viable second-home locations.",
      "For sellers, the message is one of confidence rather than urgency. Well-presented, correctly priced homes are transacting within a healthy window, and standout properties with private moorings or unobstructed sea frontage continue to attract competitive interest. For buyers, the opportunity lies in the shoulder locations — towns one bay over from the marquee names — where value has yet to fully catch up to fundamentals.",
      "Our advice for the year ahead is to focus on quality of location above all. On the Adriatic, the view, the light, and the proximity to a working harbour are the assets that hold value through any cycle.",
    ],
  },
  {
    slug: "buying-property-in-croatia-guide",
    title: "A Foreign Buyer's Guide to Property in Croatia",
    excerpt:
      "From EU reciprocity rules to notary fees, here is what international buyers need to know before acquiring a home on the Croatian coast.",
    metaDescription:
      "A practical guide for foreign buyers purchasing property in Croatia: legal steps, taxes, notary fees, and common pitfalls to avoid.",
    category: "Buyer Guides",
    cover:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80",
    author: "Adriatic Estates",
    date: "2025-11-28",
    readMinutes: 8,
    body: [
      "Buying on the Croatian coast is more straightforward than many international buyers expect, but it rewards preparation. Since Croatia's accession to the EU, buyers from member states may acquire property on broadly the same footing as domestic buyers, while non-EU nationals purchase under a reciprocity framework that our team navigates on your behalf.",
      "The transaction itself follows a clear sequence: an agreed offer, a pre-contract with a deposit (typically ten percent), legal due diligence on the title and land registry, and a final notarised contract. A licensed notary authenticates the signatures, and ownership is registered with the local land registry court.",
      "Budget for acquisition costs beyond the headline price. Real estate transfer tax is levied on second-hand homes, while new builds from a VAT-registered developer are treated differently. Add notary and registration fees, and — if you engage one, which we recommend — an independent lawyer.",
      "The most common pitfall is an incomplete or contested title, particularly for older properties passed down through families. Thorough due diligence on the land registry and cadastre is non-negotiable, and it is precisely where an experienced local advisor earns their fee.",
    ],
  },
  {
    slug: "designing-a-timeless-coastal-villa",
    title: "Designing a Timeless Coastal Villa",
    excerpt:
      "The most enduring Adriatic homes borrow from centuries of Mediterranean craft. A look at the materials and principles that never date.",
    metaDescription:
      "Design principles behind timeless Adriatic villas: natural stone, lime plaster, shade, and the indoor-outdoor living that defines coastal luxury.",
    category: "Design & Living",
    cover:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    author: "Adriatic Estates",
    date: "2025-10-09",
    readMinutes: 5,
    body: [
      "The villas that hold their beauty — and their value — over decades tend to resist fashion. They draw instead on a Mediterranean vocabulary refined over centuries: local stone, lime-washed plaster, terracotta, and timber weathered by salt air.",
      "Light is the first material. Deep loggias, shuttered windows, and pergolas are not merely decorative; they choreograph the day, offering shade at noon and framing the long gold of a coastal evening. A well-designed Adriatic home works with the sun rather than against it.",
      "The second principle is the dissolving of the boundary between inside and out. Retractable glazing, level thresholds, and outdoor kitchens turn a terrace into the true living room for half the year. The pool, ideally, reads as an extension of the sea beyond it.",
      "Finally, restraint. The finest coastal interiors let the view do the talking — a calm palette, honest materials, and rooms scaled for gathering. It is a discipline that photographs beautifully and lives even better.",
    ],
  },
  {
    slug: "why-slovenia-coast-is-the-next-hotspot",
    title: "Why the Slovenian Coast Is the Next Quiet Hotspot",
    excerpt:
      "Compact, cultured, and just minutes from Italy, Slovenia's short coastline is drawing discerning buyers who want the Adriatic without the crowds.",
    metaDescription:
      "Piran, Portoroz and the Slovenian Adriatic coast are emerging luxury property hotspots. Here is why discerning buyers are looking closely.",
    category: "Location Spotlight",
    cover:
      "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1600&q=80",
    author: "Adriatic Estates Research",
    date: "2025-09-02",
    readMinutes: 5,
    body: [
      "Slovenia's coastline is barely forty-six kilometres long, and that scarcity is exactly the point. Between the Venetian-Gothic streets of Piran and the elegant seafront of Portoroz sits one of the Adriatic's most cultured — and most overlooked — stretches of coast.",
      "Proximity is a large part of the appeal. Trieste and its airport are minutes away, Venice is a short drive, and Ljubljana's capital amenities sit just over an hour inland. Buyers gain the rhythm of the Adriatic without sacrificing connectivity.",
      "Supply is genuinely limited. With so little coast and strict heritage protection in the historic towns, quality inventory rarely lingers. Restored townhouses in Piran and villas in the hills above Portoroz remain the standout assets.",
      "For buyers priced out of the marquee Italian and Croatian names, the Slovenian coast offers a rare combination: authenticity, accessibility, and room for values to grow. We expect it to remain a quiet hotspot — for now.",
    ],
  },
];

export function getAllInsights(): InsightArticle[] {
  return [...INSIGHT_ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
}

export function getInsightBySlug(slug: string): InsightArticle | undefined {
  return INSIGHT_ARTICLES.find((a) => a.slug === slug);
}

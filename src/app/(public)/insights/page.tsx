import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { getAllInsights } from "@/lib/insights";
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Market Insights",
  description:
    "Market reports, buyer guides and location spotlights from the Adriatic luxury property specialists.",
};

/** Market Insights / Blog index — curated articles for SEO and lead nurture. */
export default async function InsightsPage() {
  const [articles, { t, locale }] = await Promise.all([
    getAllInsights(),
    getTranslations(),
  ]);

  const dateLocale = locale === "sl" ? "sl-SI" : "en-GB";
  const [featured, ...rest] = articles;

  return (
    <div className="pt-36">
      <Container className="pb-28">
        <SectionHeading
          align="center"
          eyebrow={t("insights.eyebrow")}
          title={t("insights.title")}
          subtitle={t("insights.subtitle")}
        />

        {/* Featured lead article */}
        <Reveal>
          <Link
            href={`/insights/${featured.slug}`}
            className="group mt-14 grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
          >
            <div className="img-zoom relative aspect-[16/10] overflow-hidden rounded-[var(--radius-base)] bg-charcoal">
              <Image
                src={featured.cover}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow text-accent">
                {featured.category} · {t("insights.minRead").replace("{min}", String(featured.readMinutes))}
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-cream transition-colors group-hover:text-accent sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/60">
                {featured.excerpt}
              </p>
              <p className="mt-5 text-sm text-cream/45">
                {new Date(featured.date).toLocaleDateString(dateLocale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm tracking-wide text-cream transition-all group-hover:gap-3 group-hover:text-accent">
                {t("insights.readArticle")}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Grid of remaining articles */}
        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.05}>
              <Link
                href={`/insights/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-base)] bg-charcoal ring-1 ring-cream/10 transition-all duration-500 hover:ring-accent/40"
              >
                <div className="img-zoom relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={article.cover}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-accent">{article.category}</p>
                  <h3 className="mt-3 font-display text-xl leading-snug text-cream transition-colors group-hover:text-accent">
                    {article.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream/55">
                    {article.excerpt}
                  </p>
                  <p className="mt-auto pt-5 text-xs text-cream/40">
                    {new Date(article.date).toLocaleDateString(dateLocale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {" · "}
                    {t("insights.minRead").replace(
                      "{min}",
                      String(article.readMinutes),
                    )}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}

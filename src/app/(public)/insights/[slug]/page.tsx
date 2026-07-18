import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import {
  getAllInsights,
  getInsightBySlug,
  INSIGHT_ARTICLES,
} from "@/lib/insights";
import { getTranslations } from "@/lib/i18n";

/** Pre-render every article at build time for fast, SEO-friendly delivery. */
export function generateStaticParams() {
  return INSIGHT_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) return { title: "Not found" };

  return {
    title: article.title,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.date,
      images: [article.cover],
    },
  };
}

/** Market Insights article — long-form editorial content, SEO-optimised. */
export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, { t, locale }] = await Promise.all([
    Promise.resolve(getInsightBySlug(slug)),
    getTranslations(),
  ]);

  if (!article) notFound();

  const dateLocale = locale === "sl" ? "sl-SI" : "en-GB";
  const formattedDate = new Date(article.date).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const related = getAllInsights()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <article>
      {/* Hero */}
      <section className="relative flex min-h-[65vh] items-end overflow-hidden">
        <Image
          src={article.cover}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/60 to-base/20" />
        <Container className="relative z-10 pb-16">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("insights.backToInsights")}
          </Link>
          <p className="eyebrow mt-6 text-accent">
            {article.category} ·{" "}
            {t("insights.minRead").replace("{min}", String(article.readMinutes))}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-sm text-cream/60">
            {article.author} · {formattedDate}
          </p>
        </Container>
      </section>

      {/* Body */}
      <Container size="narrow" className="py-20">
        <Reveal>
          <div className="space-y-6">
            <p className="text-xl font-light leading-relaxed text-cream/80">
              {article.excerpt}
            </p>
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-cream/70">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </Container>

      {/* Related */}
      <section className="border-t border-cream/10 bg-charcoal py-20">
        <Container>
          <p className="eyebrow text-accent">{t("insights.relatedTitle")}</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/insights/${rel.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-base)] bg-base ring-1 ring-cream/10 transition-all duration-500 hover:ring-accent/40"
              >
                <div className="img-zoom relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={rel.cover}
                    alt={rel.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-accent">{rel.category}</p>
                  <h3 className="mt-3 font-display text-lg leading-snug text-cream transition-colors group-hover:text-accent">
                    {rel.title}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm text-cream/70 transition-all group-hover:gap-3 group-hover:text-accent">
                    {t("insights.readArticle")}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </article>
  );
}

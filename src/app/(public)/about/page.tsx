import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { AgentCard } from "@/components/shared/AgentCard";
import { Testimonials } from "@/components/shared/Testimonials";
import { FinalCta } from "@/components/portal/PortalHome";
import { getSettings } from "@/lib/settings";
import { getTranslations } from "@/lib/i18n";
import { getStats, getAgents } from "@/lib/queries";
import { formatPriceCompact } from "@/lib/format";

export const metadata: Metadata = { title: "About" };

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=2000&q=80";
const MISSION_IMAGE =
  "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=2000&q=80";

/** About page — brand story, mission, team and trust (shared across both modes). */
export default async function AboutPage() {
  const [settings, stats, agents, { t }] = await Promise.all([
    getSettings(),
    getStats(),
    getAgents(),
    getTranslations(),
  ]);

  const founder = agents[0];

  const keyStats = [
    { value: "240+", label: t("about.statSold") },
    { value: "20+", label: t("about.statYears") },
    { value: "500+", label: t("about.statClients") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden">
        <div data-parallax className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/50 to-base/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-base/50 to-transparent" />
        <Container className="relative z-10 pb-24">
          <p className="eyebrow hero-rise text-accent" style={{ animationDelay: "0.1s" }}>
            {t("about.eyebrow")}
          </p>
          <h1
            className="hero-rise mt-5 max-w-4xl font-display text-5xl leading-[1.05] text-cream sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s" }}
          >
            {settings.name}
          </h1>
          <div
            className="hero-rise mt-8 flex items-center gap-5"
            style={{ animationDelay: "0.45s" }}
          >
            <span className="h-px w-16 bg-accent" />
            <p className="max-w-md text-lg text-cream/75">{settings.tagline}</p>
          </div>
        </Container>
      </section>

      {/* Story — editorial spread */}
      <section className="py-28 lg:py-36">
        <Container>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal className="lg:sticky lg:top-32">
                <p className="eyebrow mb-4 text-accent">{t("about.title")}</p>
                <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl">
                  {t("brand.sectionTitle")}
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal className="space-y-8">
                <p className="text-xl leading-relaxed text-cream/80 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.7] first-letter:text-accent sm:text-2xl">
                  {t("brand.sectionBody")}
                </p>
                <p className="text-lg leading-relaxed text-cream/65">
                  From the walled city of Dubrovnik to the fjords of Kotor and
                  the gentle bays of the Slovenian Riviera, we represent
                  residences of genuine architectural and historic significance
                  — always with absolute discretion.
                </p>
                <p className="text-lg leading-relaxed text-cream/65">
                  Our advisors are specialists in their regions, and our clients
                  return to us because we understand that acquiring a home on
                  this coast is not a transaction but the beginning of a life
                  lived well.
                </p>

                {founder && (
                  <div className="flex items-center gap-4 pt-4">
                    <span className="h-px w-10 bg-cream/20" />
                    <div>
                      <p className="font-display text-2xl italic text-cream">
                        {founder.name}
                      </p>
                      <p className="eyebrow mt-1 text-accent">{founder.role}</p>
                    </div>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Key stats — editorial band */}
      <section className="border-y border-cream/10 bg-charcoal/40">
        <Container>
          <div className="grid grid-cols-1 divide-y divide-cream/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {keyStats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 100}
                className="px-6 py-16 text-center sm:py-20"
              >
                <div className="font-display text-6xl text-accent lg:text-7xl">
                  {stat.value}
                </div>
                <div className="eyebrow mt-4 text-cream/50">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission — full-bleed manifesto */}
      <section className="relative overflow-hidden py-36 lg:py-44">
        <div data-parallax className="absolute inset-0">
          <Image
            src={MISSION_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-base/80" />
        <Container className="relative z-10">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="mx-auto mb-7 block h-px w-16 bg-accent" />
            <p className="eyebrow mb-4 text-accent">
              {t("about.missionEyebrow")}
            </p>
            <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">
              {t("about.missionTitle")}
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-cream/70">
              {t("about.missionBody")}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Team */}
      {agents.length > 0 && (
        <section className="py-28 lg:py-36">
          <Container>
            <SectionHeading
              align="center"
              eyebrow={t("about.teamEyebrow")}
              title={t("about.teamTitle")}
              subtitle={t("about.teamSubtitle")}
            />
            <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {agents.map((agent, i) => (
                <Reveal key={agent.id} delay={(i % 4) * 90}>
                  <AgentCard agent={agent} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Testimonials */}
      <Testimonials
        eyebrow={t("testimonials.eyebrow")}
        title={t("testimonials.title")}
        subtitle={t("testimonials.subtitle")}
      />

      <TrustStrip
        asSeenInLabel={t("brand.asSeenIn")}
        stats={[
          { value: `${stats.propertyCount}+`, label: t("brand.statsProperties") },
          { value: "3", label: t("brand.statsCountries") },
          {
            value: formatPriceCompact(stats.totalValue),
            label: t("brand.statsValue"),
          },
          { value: "20+", label: t("brand.statsYears") },
        ]}
      />

      <FinalCta
        title={t("brand.ctaTitle")}
        body={t("brand.ctaBody")}
        button={t("brand.ctaButton")}
      />
    </>
  );
}

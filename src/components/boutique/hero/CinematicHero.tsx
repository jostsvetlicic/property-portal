import { Container } from "@/components/shared/Container";
import { HeroBackground } from "@/components/shared/HeroBackground";
import { PropertySearch } from "@/components/shared/PropertySearch";
import type { PropertySearchLabels } from "@/components/shared/PropertySearch";

/*
 * Boutique hero — the original static cinematic version.
 *
 * A full-bleed property image (with a gentle scroll parallax via
 * <HeroBackground>) sits behind a centered editorial headline, a refined
 * subline and the search bar. Copy rises + fades in on load via the CSS
 * `.hero-rise` keyframes (staggered with animation-delay).
 *
 * NOTE: The award-tier 3D villa + scroll-driven camera zoom is archived in
 * ./HeroScene.tsx and ./heroProgress.ts — they are no longer imported here, so
 * nothing fetches /models/villa.glb (which was 404-ing and surfacing as a Next
 * dev "issue"). Re-wire HeroScene back in to restore the 3D experience.
 */
export function CinematicHero({
  eyebrow,
  title,
  subtitle,
  image,
  locations,
  searchLabels,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  locations: string[];
  searchLabels: PropertySearchLabels;
}) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <HeroBackground src={image} />

      <Container className="relative z-10 flex flex-col items-center text-center">
        <p
          className="hero-rise eyebrow flex items-center gap-3 text-accent"
          style={{ animationDelay: "80ms" }}
        >
          <span className="h-px w-8 bg-accent/60" />
          {eyebrow}
          <span className="h-px w-8 bg-accent/60" />
        </p>

        <h1
          className="hero-rise mx-auto mt-8 max-w-4xl font-display text-5xl font-light leading-[1.04] tracking-tight text-cream sm:text-6xl lg:text-[4.75rem]"
          style={{ animationDelay: "180ms" }}
        >
          {title}
        </h1>

        <p
          className="hero-rise mx-auto mt-7 max-w-xl text-lg font-light leading-relaxed text-cream/65"
          style={{ animationDelay: "300ms" }}
        >
          {subtitle}
        </p>

        {/* Search bar below the headline — refined, rounded, soft-shadowed,
            with a thin gold hairline frame. */}
        <div
          className="hero-rise mx-auto mt-12 w-full max-w-3xl text-left"
          style={{ animationDelay: "440ms" }}
        >
          <div className="rounded-[calc(var(--radius-base)+0.25rem)] border border-accent/25 bg-charcoal/50 p-1.5 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-cream/5 backdrop-blur-xl">
            <PropertySearch
              variant="minimal"
              locations={locations}
              labels={searchLabels}
              className="border-0 bg-transparent px-5 py-3 backdrop-blur-none"
            />
          </div>
        </div>
      </Container>

      {/* scroll cue */}
      <div
        className="hero-rise absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ animationDelay: "620ms" }}
      >
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}

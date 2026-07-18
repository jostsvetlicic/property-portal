import { Container } from "./Container";
import { Reveal } from "./Reveal";

interface Stat {
  value: string;
  label: string;
}

/**
 * Stats band + "as featured in" logo placeholders. The publication names are
 * placeholders — swap them (or wire real SVG logos) per agency.
 */
export function TrustStrip({
  stats,
  asSeenInLabel,
}: {
  stats: Stat[];
  asSeenInLabel: string;
}) {
  const publications = ["FINANCIAL TIMES", "ARCHITECTURAL DIGEST", "MONOCLE", "ROBB REPORT"];

  return (
    <section className="border-y border-cream/10 bg-charcoal/40">
      <Container className="py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <div className="font-display text-4xl text-accent lg:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-widest text-cream/50">
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <p className="text-center text-[0.7rem] uppercase tracking-[0.3em] text-cream/40">
            {asSeenInLabel}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {publications.map((p) => (
              <span
                key={p}
                className="font-display text-sm tracking-[0.2em] text-cream/35"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

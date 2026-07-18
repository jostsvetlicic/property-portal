import Image from "next/image";
import { Quote } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

/**
 * Placeholder client testimonials — demo content for the seed agency, styled
 * to match the editorial design system. Shared across the home pages (both
 * modes) and the About page. Photos are curated Unsplash portraits.
 */
const TESTIMONIALS = [
  {
    quote:
      "They understood exactly what we were looking for before we could put it into words. The whole acquisition felt calm, private and completely assured.",
    name: "Isabelle Laurent",
    detail: "Villa buyer, Dubrovnik",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    quote:
      "Selling a family home is never simple, but their discretion and patience made it effortless. We were guided at every step and never once felt rushed.",
    name: "Marko Zupan",
    detail: "Estate seller, Piran",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    quote:
      "An advisor who genuinely knows the coast — every recommendation was considered, and the result exceeded what we thought possible.",
    name: "Sophia Ricci",
    detail: "Penthouse buyer, Rovinj",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
];

/** Editorial testimonials grid with placeholder client quotes and photos. */
export function Testimonials({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
        />
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <Reveal key={item.name} delay={(i % 3) * 90}>
              <figure className="flex h-full flex-col rounded-[var(--radius-base)] bg-charcoal/40 p-8 ring-1 ring-cream/10">
                <Quote
                  className="h-8 w-8 shrink-0 text-accent/60"
                  aria-hidden
                />
                <blockquote className="mt-6 flex-1 font-display text-xl leading-relaxed text-cream/85">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 border-t border-cream/10 pt-6">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={item.photo}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-cream">
                      {item.name}
                    </span>
                    <span className="block text-xs uppercase tracking-widest text-accent">
                      {item.detail}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

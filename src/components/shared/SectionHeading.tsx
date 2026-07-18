import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

/** Editorial section heading with an optional eyebrow label. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-3 text-accent">{eyebrow}</p>}
      <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-cream/60">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

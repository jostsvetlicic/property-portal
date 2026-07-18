import { createElement } from "react";
import { cn } from "@/lib/cn";

type Fx = "up" | "left" | "right" | "scale" | "clip";

/**
 * Declarative scroll-reveal marker.
 *
 * Renders its element with a `data-fx` attribute; the site-wide <ScrollFX>
 * controller animates it (fade + slide/scale/clip) and auto-staggers siblings
 * that enter together via ScrollTrigger.batch. No per-element observer — one
 * GSAP engine drives the whole page.
 *
 * `prefers-reduced-motion` and no-JS are handled by the CSS gate in globals.css
 * (content shows statically), so this stays a lightweight server component.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  fx = "up",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  fx?: Fx;
  as?: React.ElementType;
}) {
  return createElement(
    Tag,
    {
      className: cn(className),
      "data-fx": fx,
      ...(delay ? { "data-fx-delay": String(delay) } : {}),
    },
    children,
  );
}

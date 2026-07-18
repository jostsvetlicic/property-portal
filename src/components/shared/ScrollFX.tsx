"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Site-wide scroll choreography (the "award template" layer).
 *
 * A single controller — mounted once in the public layout — drives every
 * scroll-linked effect from data attributes, so pages stay declarative:
 *
 *   • Reveals   `[data-fx]`        fade + slide/scale/clip in, auto-STAGGERED
 *                                  via ScrollTrigger.batch as a group enters.
 *   • Parallax  `[data-parallax]`  backgrounds drift slower than the scroll.
 *   • Magnetic  `[data-magnetic]`  buttons ease toward the cursor (gold glow
 *                                  is CSS) with a spring-y quickTo.
 *
 * Re-runs on route change (keyed on pathname) inside a gsap.context so all
 * triggers/listeners created here are reverted cleanly on navigation — it never
 * touches the hero's own pinned trigger (which uses classes, not these attrs).
 *
 * Fully disabled under prefers-reduced-motion (content is shown statically).
 */
const EASE = "power3.out";

export function ScrollFX() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    // Gate CSS hides [data-fx] only now that JS is confirmed live (pre-paint,
    // so there's no flash of un-hidden content).
    document.documentElement.classList.add("fx-ready");

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // ---- Reveals (batched → group stagger) --------------------------------
      const initial: Record<string, gsap.TweenVars> = {
        up: { opacity: 0, y: 48 },
        left: { opacity: 0, x: -64 },
        right: { opacity: 0, x: 64 },
        scale: { opacity: 0, scale: 0.92 },
        clip: { opacity: 1, clipPath: "inset(0 0 100% 0)", scale: 1.12 },
      };

      const revealEls = gsap.utils.toArray<HTMLElement>("[data-fx]");
      // Set each element's hidden starting pose up front.
      revealEls.forEach((el) => {
        const kind = el.dataset.fx || "up";
        gsap.set(el, initial[kind] ?? initial.up);
      });

      ScrollTrigger.batch("[data-fx]", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          // Group the entering batch by effect kind so each animates correctly
          // while still sharing one staggered cascade.
          batch.forEach((el, i) => {
            const kind = (el as HTMLElement).dataset.fx || "up";
            const delayStagger =
              parseFloat((el as HTMLElement).dataset.fxDelay || "0") / 1000;

            const to: gsap.TweenVars = {
              duration: kind === "clip" ? 1.4 : 1.1,
              ease: EASE,
              delay: delayStagger + i * 0.08,
              overwrite: "auto",
            };
            if (kind === "clip") {
              to.clipPath = "inset(0 0 0% 0)";
              to.scale = 1;
            } else if (kind === "left" || kind === "right") {
              to.opacity = 1;
              to.x = 0;
            } else if (kind === "scale") {
              to.opacity = 1;
              to.scale = 1;
            } else {
              to.opacity = 1;
              to.y = 0;
            }
            gsap.to(el, to);
          });
        },
      });

      // ---- Parallax ---------------------------------------------------------
      // The element is held at a constant 1.2 scale (GSAP owns the whole
      // transform) so the ±drift never exposes an edge of a full-bleed image.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed || "1");
        const range = 8 * speed; // percent of the element's own height
        gsap.fromTo(
          el,
          { yPercent: -range, scale: 1.2 },
          {
            yPercent: range,
            scale: 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });
    cleanups.push(() => ctx.revert());

    // ---- Magnetic buttons (imperative; outside the tween context) -----------
    const magnets = gsap.utils.toArray<HTMLElement>("[data-magnetic]");
    magnets.forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      const strength = 0.4;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        gsap.set(el, { x: 0, y: 0 });
      });
    });

    // Recalculate once fonts/images settle so start positions are accurate.
    ScrollTrigger.refresh();

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Full-bleed cinematic hero backdrop with a subtle scroll parallax.
 *
 * The image sits in an over-scaled layer that we translate a fraction of the
 * scroll distance (via requestAnimationFrame + a CSS variable), so it drifts
 * slowly behind the content as the page moves — the calm, expensive feel of
 * Sotheby's / Compass. A soft dark gradient keeps the headline legible.
 *
 * Respects `prefers-reduced-motion`: the parallax is simply not attached.
 */
export function HeroBackground({
  src,
  alt = "",
  priority = true,
}: {
  src: string;
  alt?: string;
  priority?: boolean;
}) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // Move the image at ~28% of scroll speed for a gentle parallax.
      const offset = Math.min(window.scrollY * 0.28, 240);
      el.style.setProperty("--parallax", `${offset}px`);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={layerRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "translateY(var(--parallax, 0px))" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="scale-[1.12] object-cover"
        />
      </div>

      {/* Soft dark gradient — bottom-anchored so the base color blends in and
          the headline stays legible over any image. */}
      <div className="absolute inset-0 bg-gradient-to-b from-base/50 via-base/25 to-base" />
      <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent" />
    </div>
  );
}

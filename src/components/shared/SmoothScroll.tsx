"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Buttery smooth scrolling (Lenis) wired to GSAP's ticker and ScrollTrigger.
 *
 * Rather than running its own rAF loop, Lenis is advanced from GSAP's ticker so
 * scroll position, ScrollTrigger and the WebGL frameloop all march to the same
 * clock — no jitter between the smooth scroll and scroll-driven animations.
 *
 * Disabled when the user prefers reduced motion (native scrolling instead).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Slow and weighty: a longer glide with a gentle wheel multiplier gives the
    // scroll a heavy, expensive momentum (Lenis default is 1.0 / snappier).
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      // GSAP ticker time is in seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

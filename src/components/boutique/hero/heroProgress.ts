/**
 * Shared scroll-progress channel for the cinematic hero.
 *
 * The pinned GSAP ScrollTrigger (a DOM-side concern in <CinematicHero>) writes a
 * normalized 0→1 value here as the user scrolls through the pinned hero. The R3F
 * <CameraRig> (inside the WebGL <HeroScene>) reads it every frame and damps the
 * camera toward the target — so the two worlds stay decoupled but in sync.
 *
 * A plain module-level object (not React state/context) is deliberate: it avoids
 * re-renders on every scroll tick and survives the dynamic `ssr:false` import
 * boundary between the two components.
 */
export const heroProgress = { current: 0 };

"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { cn } from "@/lib/cn";

interface GalleryImage {
  url: string;
  alt?: string | null;
}

/**
 * Large image carousel with thumbnail strip and full-screen lightbox.
 * Used on the property detail page (both modes).
 */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length;
  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  if (count === 0) return null;

  return (
    <div>
      {/* Main image — cinematic crossfade between stacked layers */}
      <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-base)] bg-charcoal">
        {images.map((img, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform]",
              i === index
                ? "scale-100 opacity-100"
                : "scale-[1.04] opacity-0",
            )}
          >
            <Image
              src={img.url}
              alt={img.alt ?? "Property image"}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Bottom scrim for control legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-base/50 to-transparent" />

        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-base/60 text-cream backdrop-blur transition hover:bg-accent hover:text-base"
          aria-label="Open full screen"
        >
          <Expand className="h-4 w-4" />
        </button>

        {count > 1 && (
          <>
            <GalleryArrow dir="left" onClick={() => go(-1)} />
            <GalleryArrow dir="right" onClick={() => go(1)} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-base/60 px-3 py-1 text-xs tracking-wider text-cream backdrop-blur">
              {index + 1} / {count}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-[4/3] h-20 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                i === index
                  ? "ring-accent"
                  : "ring-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `Thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-base/97 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-6 top-6 text-cream hover:text-accent"
            aria-label="Close"
          >
            <X className="h-7 w-7" />
          </button>
          <div className="relative h-[82vh] w-[92vw] max-w-6xl">
            {images.map((img, i) => (
              <div
                key={i}
                aria-hidden={i !== index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === index ? "opacity-100" : "opacity-0",
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? "Property image"}
                  fill
                  sizes="92vw"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          {count > 1 && (
            <>
              <GalleryArrow dir="left" onClick={() => go(-1)} large />
              <GalleryArrow dir="right" onClick={() => go(1)} large />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GalleryArrow({
  dir,
  onClick,
  large,
}: {
  dir: "left" | "right";
  onClick: () => void;
  large?: boolean;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-base/60 text-cream backdrop-blur transition hover:bg-accent hover:text-base",
        large ? "h-12 w-12" : "h-10 w-10 opacity-0 group-hover:opacity-100",
        dir === "left" ? "left-4" : "right-4",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

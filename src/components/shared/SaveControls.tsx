"use client";

import { Heart, Scale, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSaved } from "./SavedProvider";

/**
 * Heart (favorite) + compare toggle for a single property. Two variants:
 *  - "overlay": floating round buttons, positioned over a card image. Because
 *    cards are wrapped in a <Link>, clicks must not bubble to navigation.
 *  - "inline": labelled pill buttons for the detail page action bar.
 *
 * All state lives in SavedProvider (localStorage), so controls stay in sync
 * across cards, the detail page, the nav badge and the compare bar.
 */
export function SaveControls({
  propertyId,
  variant = "overlay",
  positionClass = "right-4 top-4",
  className,
}: {
  propertyId: string;
  variant?: "overlay" | "inline";
  /** Overlay anchor position (Tailwind inset utilities). */
  positionClass?: string;
  className?: string;
}) {
  const {
    labels,
    hydrated,
    isFavorite,
    toggleFavorite,
    isComparing,
    toggleCompare,
    compareCount,
    maxCompare,
  } = useSaved();

  const saved = isFavorite(propertyId);
  const comparing = isComparing(propertyId);
  const compareDisabled = !comparing && compareCount >= maxCompare;

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        <button
          type="button"
          onClick={() => toggleFavorite(propertyId)}
          aria-pressed={saved}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm tracking-wide transition-all duration-300",
            saved
              ? "border-accent/50 bg-accent/15 text-accent"
              : "border-cream/15 text-cream/80 hover:border-accent/40 hover:text-accent",
          )}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-accent")} />
          {saved ? labels.saved : labels.save}
        </button>
        <button
          type="button"
          onClick={() => toggleCompare(propertyId)}
          disabled={compareDisabled}
          aria-pressed={comparing}
          title={compareDisabled ? labels.compareFull : undefined}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm tracking-wide transition-all duration-300",
            comparing
              ? "border-accent/50 bg-accent/15 text-accent"
              : "border-cream/15 text-cream/80 hover:border-accent/40 hover:text-accent",
            compareDisabled && "cursor-not-allowed opacity-40 hover:border-cream/15 hover:text-cream/80",
          )}
        >
          {comparing ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
          {comparing ? labels.comparing : labels.compare}
        </button>
      </div>
    );
  }

  // Overlay variant — sits on card imagery.
  return (
    <div
      className={cn(
        "absolute z-10 flex items-center gap-2",
        positionClass,
        // Avoid a hydration flash: hidden until the store is read.
        hydrated ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          toggleFavorite(propertyId);
        }}
        aria-pressed={saved}
        aria-label={saved ? labels.saved : labels.save}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full backdrop-blur-md ring-1 transition-all duration-300",
          saved
            ? "bg-accent text-base ring-accent"
            : "bg-base/50 text-cream ring-cream/20 hover:bg-base/70 hover:text-accent",
        )}
      >
        <Heart className={cn("h-4 w-4", saved && "fill-base")} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          toggleCompare(propertyId);
        }}
        disabled={compareDisabled}
        aria-pressed={comparing}
        aria-label={
          compareDisabled
            ? labels.compareFull
            : comparing
              ? labels.comparing
              : labels.compare
        }
        title={compareDisabled ? labels.compareFull : undefined}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full backdrop-blur-md ring-1 transition-all duration-300",
          comparing
            ? "bg-accent text-base ring-accent"
            : "bg-base/50 text-cream ring-cream/20 hover:bg-base/70 hover:text-accent",
          compareDisabled && "cursor-not-allowed opacity-40 hover:bg-base/50 hover:text-cream",
        )}
      >
        {comparing ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
      </button>
    </div>
  );
}

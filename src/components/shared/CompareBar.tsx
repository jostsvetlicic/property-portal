"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSaved } from "./SavedProvider";

/**
 * Floating bar that appears when properties are selected for comparison. Anchored
 * bottom-centre; slides up on selection, hides when empty. On-brand glass panel.
 */
export function CompareBar() {
  const { labels, hydrated, compareCount, maxCompare, clearCompare } = useSaved();
  const pathname = usePathname();
  const open = hydrated && compareCount > 0 && pathname !== "/compare";

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        open
          ? "pointer-events-none translate-y-0 pb-6 opacity-100"
          : "pointer-events-none translate-y-full pb-6 opacity-0",
      )}
      aria-hidden={!open}
    >
      <div className="pointer-events-auto flex items-center gap-4 rounded-full border border-cream/12 bg-base/80 px-4 py-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:gap-5 sm:px-5">
        <span className="flex items-center gap-2.5 pl-1 text-sm text-cream/80">
          <Scale className="h-4 w-4 text-accent" />
          <span className="tabular-nums">
            {labels.compareBarSelected
              .replace("{count}", String(compareCount))
              .replace("{max}", String(maxCompare))}
          </span>
        </span>

        <button
          type="button"
          onClick={clearCompare}
          className="inline-flex items-center gap-1.5 text-sm text-cream/50 transition-colors hover:text-cream"
        >
          <X className="h-3.5 w-3.5" />
          {labels.clear}
        </button>

        <Link
          href="/compare"
          className="btn-glow inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium tracking-wide text-base transition-colors hover:bg-accent-soft"
        >
          {labels.compareCta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

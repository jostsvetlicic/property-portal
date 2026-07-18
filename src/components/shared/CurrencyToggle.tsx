"use client";

import type { CurrencyCode } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCurrency } from "./CurrencyProvider";

const OPTIONS: CurrencyCode[] = ["EUR", "USD"];

/**
 * EUR / USD display-currency toggle. Sits on the listings pages; the choice is
 * persisted and applies to every price across the site.
 */
export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-cream/15 p-1",
        className,
      )}
      role="group"
      aria-label="Display currency"
    >
      {OPTIONS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition",
            currency === c
              ? "bg-accent text-base"
              : "text-cream/70 hover:text-accent",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

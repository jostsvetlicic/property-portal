"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/cn";
import type { Locale } from "@/types";

const COOKIE_NAME = "locale";
const LABELS: Record<Locale, string> = { en: "EN", sl: "SL" };

/**
 * Locale toggle. Writes the `locale` cookie client-side and refreshes so the
 * server components re-render with the new dictionary. Kept dependency-free.
 */
export function LanguageSwitcher({
  locales,
  active,
  className,
}: {
  locales: Locale[];
  active: Locale;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === active) return;
    document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs tracking-widest",
        isPending && "opacity-60",
        className,
      )}
      aria-label="Language"
    >
      {locales.map((loc, idx) => (
        <span key={loc} className="flex items-center gap-1">
          {idx > 0 && <span className="opacity-30">/</span>}
          <button
            type="button"
            onClick={() => setLocale(loc)}
            className={cn(
              "transition-colors hover:text-accent",
              loc === active ? "text-accent" : "opacity-70",
            )}
            aria-current={loc === active}
          >
            {LABELS[loc] ?? loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

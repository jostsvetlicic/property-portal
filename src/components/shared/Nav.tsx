"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Search, Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useSaved } from "./SavedProvider";
import { PROPERTY_TYPES, type Locale, type Mode } from "@/types";

export interface NavLabels {
  listings: string;
  agents: string;
  insights: string;
  about: string;
  contact: string;
  favorites: string;
  savedSearches: string;
  menu: string;
  close: string;
  searchLocation: string;
  searchType: string;
  anyType: string;
  search: string;
}

/** Nav favorites link with a live saved-count badge. */
function FavoritesLink({
  label,
  active,
  onNavigate,
  variant,
}: {
  label: string;
  active: boolean;
  onNavigate?: () => void;
  variant: "desktop" | "mobile";
}) {
  const { hydrated, favoritesCount } = useSaved();

  if (variant === "mobile") {
    return (
      <Link
        href="/favorites"
        onClick={onNavigate}
        className="flex items-center gap-3 font-display text-3xl text-cream transition-colors hover:text-accent"
      >
        <Heart className="h-6 w-6 text-accent" />
        {label}
        {hydrated && favoritesCount > 0 && (
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1.5 text-sm font-medium text-base">
            {favoritesCount}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/favorites"
      aria-label={label}
      className={cn(
        "relative flex items-center transition-colors hover:text-accent",
        active ? "text-accent" : "text-cream/85",
      )}
    >
      <Heart className="h-5 w-5" />
      {hydrated && favoritesCount > 0 && (
        <span className="absolute -right-2.5 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold tabular-nums text-base">
          {favoritesCount}
        </span>
      )}
    </Link>
  );
}

/**
 * Primary site navigation. Mode-aware:
 *  - PORTAL: transparent over the hero, becomes solid on scroll, and reveals a
 *    compact inline search bar (Avantgarde-style) once scrolled past the hero.
 *  - BOUTIQUE: stays minimal and transparent; no search — brand is the hero.
 */
export function Nav({
  logoText,
  mode,
  locale,
  locales,
  labels,
}: {
  logoText: string;
  mode: Mode;
  locale: Locale;
  locales: Locale[];
  labels: NavLabels;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Solid background + (portal) search reveal after scrolling past ~70vh hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/listings", label: labels.listings },
    { href: "/agents", label: labels.agents },
    { href: "/insights", label: labels.insights },
    { href: "/about", label: labels.about },
    { href: "/contact", label: labels.contact },
  ];

  const showPortalSearch = mode === "portal" && scrolled;

  function onQuickSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const loc = String(form.get("location") ?? "").trim();
    const type = String(form.get("type") ?? "").trim();
    if (loc) params.set("location", loc);
    if (type) params.set("type", type);
    router.push(`/listings${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        scrolled
          ? "bg-base/80 backdrop-blur-2xl border-b border-cream/10 py-3 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
          : "bg-transparent py-6",
      )}
    >
      <nav className="mx-auto flex max-w-[100rem] items-center gap-6 px-6 sm:px-8 lg:px-12">
        {/* Wordmark (shrinks on scroll) */}
        <Link
          href="/"
          className={cn(
            "font-display tracking-[0.2em] text-cream transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent shrink-0 origin-left",
            scrolled ? "text-base" : "text-lg",
          )}
        >
          {logoText}
        </Link>

        {/* Portal inline search (revealed on scroll) */}
        {mode === "portal" && (
          <form
            onSubmit={onQuickSearch}
            className={cn(
              "hidden flex-1 items-center gap-2 transition-all duration-500 lg:flex",
              showPortalSearch
                ? "max-w-md opacity-100"
                : "pointer-events-none max-w-0 opacity-0",
            )}
          >
            <div className="flex w-full items-center gap-2 rounded-full border border-cream/15 bg-cream/5 px-4 py-2">
              <Search className="h-4 w-4 text-accent" />
              <input
                name="location"
                placeholder={labels.searchLocation}
                className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
              />
              <select
                name="type"
                aria-label={labels.searchType}
                className="bg-transparent text-sm text-cream/70 focus:outline-none [&>option]:text-base"
              >
                <option value="">{labels.anyType}</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-base hover:bg-accent-soft"
              >
                {labels.search}
              </button>
            </div>
          </form>
        )}

        {/* Desktop links */}
        <div
          className={cn(
            "ml-auto hidden items-center gap-8 lg:flex",
            mode === "portal" && showPortalSearch && "ml-4",
          )}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm tracking-wide transition-colors hover:text-accent",
                pathname === l.href ? "text-accent" : "text-cream/85",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/saved-searches"
            aria-label={labels.savedSearches}
            className={cn(
              "flex items-center transition-colors hover:text-accent",
              pathname === "/saved-searches" ? "text-accent" : "text-cream/85",
            )}
          >
            <Bookmark className="h-5 w-5" />
          </Link>
          <FavoritesLink
            label={labels.favorites}
            active={pathname === "/favorites"}
            variant="desktop"
          />
          <LanguageSwitcher locales={locales} active={locale} />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto text-cream lg:hidden"
          aria-label={menuOpen ? labels.close : labels.menu}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 top-0 z-40 flex flex-col bg-base/98 backdrop-blur-xl transition-all duration-500 lg:hidden",
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="font-display text-lg tracking-[0.2em] text-cream">
            {logoText}
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={labels.close}
            className="text-cream"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 px-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-3xl text-cream transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          <FavoritesLink
            label={labels.favorites}
            active={pathname === "/favorites"}
            onNavigate={() => setMenuOpen(false)}
            variant="mobile"
          />
          <Link
            href="/saved-searches"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 font-display text-3xl text-cream transition-colors hover:text-accent"
          >
            <Bookmark className="h-6 w-6 text-accent" />
            {labels.savedSearches}
          </Link>
        </div>
        <div className="px-8 py-10">
          <LanguageSwitcher
            locales={locales}
            active={locale}
            className="text-base"
          />
        </div>
      </div>
    </header>
  );
}

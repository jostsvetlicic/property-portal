"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Client-side persistence for the favorites + compare features. There is no
 * public user account, so saved property ids live in localStorage and are
 * shared across the app through this context. Both lists hold property ids.
 *
 *  - favorites: unbounded set of hearted properties (shown on /favorites)
 *  - compare:   a small selection (max 3) shown side-by-side on /compare
 */

const MAX_COMPARE = 3;
const FAV_KEY = "ae:favorites";
const CMP_KEY = "ae:compare";

/** Translated chrome for every favorites/compare control (resolved server-side). */
export interface SavedLabels {
  save: string;
  saved: string;
  compare: string;
  comparing: string;
  compareFull: string;
  favoritesLink: string;
  favoritesTitle: string;
  favoritesEyebrow: string;
  favoritesEmpty: string;
  favoritesEmptyCta: string;
  compareTitle: string;
  compareEyebrow: string;
  compareEmpty: string;
  compareBarSelected: string;
  compareCta: string;
  clear: string;
  remove: string;
  viewProperty: string;
  colPrice: string;
  colLocation: string;
  colType: string;
  colBeds: string;
  colBaths: string;
  colArea: string;
  colFeatures: string;
}

interface SavedContextValue {
  labels: SavedLabels;
  hydrated: boolean;
  favorites: string[];
  compare: string[];
  favoritesCount: number;
  compareCount: number;
  maxCompare: number;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  isComparing: (id: string) => boolean;
  toggleCompare: (id: string) => boolean;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
}

const SavedContext = createContext<SavedContextValue | null>(null);

function readIds(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

export function SavedProvider({
  labels,
  children,
}: {
  labels: SavedLabels;
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  // Load once on mount (client only), then flag as hydrated so counts render.
  useEffect(() => {
    setFavorites(readIds(FAV_KEY));
    setCompare(readIds(CMP_KEY));
    setHydrated(true);
  }, []);

  // Persist on change (only after hydration to avoid clobbering stored values).
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CMP_KEY, JSON.stringify(compare));
  }, [compare, hydrated]);

  // Keep multiple tabs / components in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAV_KEY) setFavorites(readIds(FAV_KEY));
      if (e.key === CMP_KEY) setCompare(readIds(CMP_KEY));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev],
    );
  }, []);

  // Returns false when the selection is already full and the id isn't in it.
  const toggleCompare = useCallback((id: string) => {
    let ok = true;
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) {
        ok = false;
        return prev;
      }
      return [...prev, id];
    });
    return ok;
  }, []);

  const removeCompare = useCallback((id: string) => {
    setCompare((prev) => prev.filter((x) => x !== id));
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const value = useMemo<SavedContextValue>(
    () => ({
      labels,
      hydrated,
      favorites,
      compare,
      favoritesCount: favorites.length,
      compareCount: compare.length,
      maxCompare: MAX_COMPARE,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      isComparing: (id) => compare.includes(id),
      toggleCompare,
      removeCompare,
      clearCompare,
    }),
    [
      labels,
      hydrated,
      favorites,
      compare,
      toggleFavorite,
      toggleCompare,
      removeCompare,
      clearCompare,
    ],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within a SavedProvider");
  return ctx;
}

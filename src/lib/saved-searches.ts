"use client";

/**
 * Client-side persistence for saved searches and recently-viewed listings.
 *
 * There is no public user account, so both live in localStorage. A saved search
 * is a named snapshot of the current filter querystring; recently-viewed holds
 * the most recent property slugs the visitor opened.
 */

export interface SavedSearch {
  id: string;
  name: string;
  query: string; // URL querystring, e.g. "listingType=rent&location=Ljubljana"
  createdAt: number;
}

const SEARCH_KEY = "pp:saved-searches";
const RECENT_KEY = "pp:recently-viewed";
const RECENT_MAX = 12;

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function getSavedSearches(): SavedSearch[] {
  return read<SavedSearch>(SEARCH_KEY);
}

export function addSavedSearch(name: string, query: string): SavedSearch[] {
  const list = getSavedSearches();
  const entry: SavedSearch = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim() || "Untitled search",
    query,
    createdAt: Date.now(),
  };
  const next = [entry, ...list];
  localStorage.setItem(SEARCH_KEY, JSON.stringify(next));
  return next;
}

export function removeSavedSearch(id: string): SavedSearch[] {
  const next = getSavedSearches().filter((s) => s.id !== id);
  localStorage.setItem(SEARCH_KEY, JSON.stringify(next));
  return next;
}

export function getRecentlyViewed(): string[] {
  return read<string>(RECENT_KEY);
}

/** Records a viewed property slug at the front, de-duplicated and capped. */
export function pushRecentlyViewed(slug: string): void {
  const list = getRecentlyViewed().filter((s) => s !== slug);
  const next = [slug, ...list].slice(0, RECENT_MAX);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

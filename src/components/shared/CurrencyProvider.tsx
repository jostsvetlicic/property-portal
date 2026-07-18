"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CurrencyCode } from "@/lib/format";

/**
 * Client-side display-currency preference (EUR / USD). Like the favorites
 * store, this is a lightweight localStorage-backed context — there is no user
 * account. Prices are stored in a single base currency in the DB; this only
 * changes how they are displayed across the site, and the choice persists.
 */

const KEY = "ae:currency";
const DEFAULT: CurrencyCode = "EUR";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  hydrated: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Always start from the deterministic default so the server render and the
  // first client render match; read the stored preference after mount.
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "EUR" || stored === "USD") setCurrencyState(stored);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && (e.newValue === "EUR" || e.newValue === "USD")) {
        setCurrencyState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency, hydrated }),
    [currency, setCurrency, hydrated],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}

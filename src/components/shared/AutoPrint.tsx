"use client";

import { useEffect } from "react";

/** Triggers the browser print dialog once the listing sheet has mounted. */
export function AutoPrint() {
  useEffect(() => {
    const id = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}

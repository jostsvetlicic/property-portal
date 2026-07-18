"use client";

import { useEffect } from "react";
import { pushRecentlyViewed } from "@/lib/saved-searches";

/** Records the current property slug into the visitor's recently-viewed list. */
export function RecentlyViewedTracker({ slug }: { slug: string }) {
  useEffect(() => {
    pushRecentlyViewed(slug);
  }, [slug]);
  return null;
}

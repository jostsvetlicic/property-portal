"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "./MapView";

/**
 * Client-only wrapper for the Leaflet map. `ssr: false` is required because
 * Leaflet accesses `window` on import.
 */
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-[var(--radius-base)] bg-charcoal text-sm text-cream/40">
      Loading map…
    </div>
  ),
});

export function MapViewDynamic(props: {
  pins: MapPin[];
  className?: string;
  zoom?: number;
}) {
  return <MapView {...props} />;
}

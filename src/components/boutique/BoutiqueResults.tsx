"use client";

import { useState } from "react";
import { LayoutList, Map as MapIcon } from "lucide-react";
import { MapViewDynamic } from "@/components/shared/MapViewDynamic";
import type { MapPin } from "@/components/shared/MapView";
import { cn } from "@/lib/cn";

/**
 * BOUTIQUE results area with a Collection ⇄ Map toggle. The curated cinematic
 * cards are passed in as `children` (server-rendered), and the map is a
 * client-only Leaflet view with clickable gold pins that open each property.
 */
export function BoutiqueResults({
  pins,
  labels,
  children,
}: {
  pins: MapPin[];
  labels: { collection: string; map: string };
  children: React.ReactNode;
}) {
  const [view, setView] = useState<"collection" | "map">("collection");

  return (
    <div className="mt-16">
      <div className="flex justify-center">
        <div className="flex items-center gap-1 rounded-full border border-cream/15 p-1">
          <ToggleBtn
            active={view === "collection"}
            onClick={() => setView("collection")}
            icon={<LayoutList className="h-4 w-4" />}
            label={labels.collection}
          />
          <ToggleBtn
            active={view === "map"}
            onClick={() => setView("map")}
            icon={<MapIcon className="h-4 w-4" />}
            label={labels.map}
          />
        </div>
      </div>

      {/* Keep the collection mounted (hidden) so scroll-FX + images don't
          re-initialise on every toggle; the map mounts only when shown. */}
      <div className={cn(view === "collection" ? "block" : "hidden")}>
        <div className="mt-16 space-y-28">{children}</div>
      </div>

      {view === "map" && (
        <div className="mt-12 h-[70vh] overflow-hidden rounded-[var(--radius-base)] ring-1 ring-cream/10">
          <MapViewDynamic pins={pins} className="h-full w-full" zoom={7} />
        </div>
      )}
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full px-5 py-2 text-xs tracking-wide transition",
        active ? "bg-accent text-base" : "text-cream/70 hover:text-accent",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

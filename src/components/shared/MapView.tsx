"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";
import { Price } from "./Price";

/**
 * Leaflet map (OpenStreetMap tiles — no API key required).
 *
 * Rendered client-side only. Import it via next/dynamic with `ssr: false`
 * (see MapView.dynamic.tsx) because Leaflet touches `window`.
 */

export interface MapPin {
  id: string;
  title: string;
  lat: number;
  lng: number;
  slug?: string;
  price?: number;
  currency?: string;
}

/** Gold pin marker built from an inline SVG (keeps assets out of /public). */
function pinIcon(accent = "#B08D57") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z" fill="${accent}"/>
      <circle cx="15" cy="15" r="6" fill="#1A1815"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "estate-pin",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
}

/** Fits the map view to all pins whenever they change. */
function FitBounds({ pins }: { pins: MapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 12);
      return;
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [pins, map]);
  return null;
}

export default function MapView({
  pins,
  className = "h-full w-full",
  zoom = 8,
}: {
  pins: MapPin[];
  className?: string;
  zoom?: number;
}) {
  const center: [number, number] = pins.length
    ? [pins[0].lat, pins[0].lng]
    : [43.5, 16.4];

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className}
      style={{ borderRadius: "var(--radius-base)" }}
    >
      {/* CARTO Voyager tiles — muted, editorial palette that suits the brand. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <FitBounds pins={pins} />
      {pins.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon()}>
          <Popup>
            {p.slug ? (
              <Link
                href={`/properties/${p.slug}`}
                className="block min-w-[140px] font-medium text-[#1A1815] no-underline"
              >
                <span className="block">{p.title}</span>
                {p.price != null && (
                  <Price
                    amount={p.price}
                    base={p.currency}
                    compact
                    className="block text-[#B08D57]"
                  />
                )}
              </Link>
            ) : (
              <span className="block min-w-[140px] font-medium text-[#1A1815]">
                {p.title}
              </span>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

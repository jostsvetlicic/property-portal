"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, Field, Input, Textarea, Select } from "@/components/admin/ui";
import { ImageUploader, type ImageItem } from "@/components/admin/ImageUploader";
import {
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  LISTING_TYPES,
  CONDITIONS,
  ENERGY_RATINGS,
} from "@/types";
import type { PropertyWithRelations } from "@/lib/queries";
import { parseFeatures } from "@/lib/format";

interface AgentOption {
  id: string;
  name: string;
}

/** Create/edit form for a property. Posts to /api/properties[/id]. */
export function PropertyForm({
  property,
  agents,
}: {
  property?: PropertyWithRelations;
  agents: AgentOption[];
}) {
  const router = useRouter();
  const editing = Boolean(property);

  const [title, setTitle] = useState(property?.title ?? "");
  const [listingType, setListingType] = useState(
    property?.listingType ?? LISTING_TYPES[0],
  );
  const [price, setPrice] = useState(property?.price?.toString() ?? "");
  const [location, setLocation] = useState(property?.location ?? "");
  const [type, setType] = useState(property?.type ?? PROPERTY_TYPES[0]);
  const [status, setStatus] = useState(property?.status ?? PROPERTY_STATUSES[0]);
  const [bedrooms, setBedrooms] = useState(property?.bedrooms?.toString() ?? "");
  const [bathrooms, setBathrooms] = useState(
    property?.bathrooms?.toString() ?? "",
  );
  const [area, setArea] = useState(property?.area?.toString() ?? "");
  const [landSize, setLandSize] = useState(
    property?.landSize?.toString() ?? "",
  );
  const [yearBuilt, setYearBuilt] = useState(
    property?.yearBuilt?.toString() ?? "",
  );
  const [floor, setFloor] = useState(property?.floor?.toString() ?? "");
  const [totalFloors, setTotalFloors] = useState(
    property?.totalFloors?.toString() ?? "",
  );
  const [condition, setCondition] = useState(property?.condition ?? "");
  const [energyRating, setEnergyRating] = useState(
    property?.energyRating ?? "",
  );
  const [parking, setParking] = useState(property?.parking ?? false);
  const [elevator, setElevator] = useState(property?.elevator ?? false);
  const [balcony, setBalcony] = useState(property?.balcony ?? false);
  const [lat, setLat] = useState(property?.lat?.toString() ?? "");
  const [lng, setLng] = useState(property?.lng?.toString() ?? "");
  const [description, setDescription] = useState(property?.description ?? "");
  const [narrative, setNarrative] = useState(property?.narrative ?? "");
  const [videoUrl, setVideoUrl] = useState(property?.videoUrl ?? "");
  const [metaTitle, setMetaTitle] = useState(property?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    property?.metaDescription ?? "",
  );
  const [features, setFeatures] = useState(
    parseFeatures(property?.features).join(", "),
  );
  const [featured, setFeatured] = useState(property?.featured ?? false);
  const [agentId, setAgentId] = useState(property?.agentId ?? "");
  const [images, setImages] = useState<ImageItem[]>(
    property?.images.map((i) => ({ url: i.url, alt: i.alt })) ?? [],
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      title,
      listingType,
      price,
      location,
      type,
      status,
      bedrooms,
      bathrooms,
      area,
      landSize,
      yearBuilt,
      floor,
      totalFloors,
      condition,
      energyRating,
      parking,
      elevator,
      balcony,
      lat,
      lng,
      description,
      narrative,
      videoUrl,
      metaTitle,
      metaDescription,
      features: features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      featured,
      agentId,
      images,
    };

    const url = editing ? `/api/properties/${property!.id}` : "/api/properties";
    const method = editing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Save failed.");
        setSaving(false);
        return;
      }
      router.push("/admin/properties");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Details
        </h2>
        <Field label="Title" htmlFor="title">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Villa Aurelia"
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Listing type"
            htmlFor="listingType"
            hint="For sale (total price) or for rent (monthly price)."
          >
            <Select
              id="listingType"
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
            >
              {LISTING_TYPES.map((l) => (
                <option key={l} value={l}>
                  {l === "sale" ? "For sale" : "For rent"}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label={listingType === "rent" ? "Price (EUR / month)" : "Price (EUR)"}
            htmlFor="price"
          >
            <Input
              id="price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder={listingType === "rent" ? "850" : "250000"}
            />
          </Field>
        </div>
        <Field label="Location" htmlFor="location">
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Ljubljana, Slovenia"
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Type" htmlFor="type">
            <Select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status" htmlFor="status">
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {PROPERTY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Bedrooms" htmlFor="bedrooms">
            <Input
              id="bedrooms"
              type="number"
              min={0}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />
          </Field>
          <Field label="Bathrooms" htmlFor="bathrooms">
            <Input
              id="bathrooms"
              type="number"
              min={0}
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            />
          </Field>
          <Field label="Area (m²)" htmlFor="area">
            <Input
              id="area"
              type="number"
              min={0}
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Specifications
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="Land size (m²)"
            htmlFor="landSize"
            hint="For houses, land and villas. Optional."
          >
            <Input
              id="landSize"
              type="number"
              min={0}
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
            />
          </Field>
          <Field label="Year built" htmlFor="yearBuilt">
            <Input
              id="yearBuilt"
              type="number"
              min={0}
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
              placeholder="2015"
            />
          </Field>
          <Field
            label="Energy rating"
            htmlFor="energyRating"
            hint="Required in the EU market."
          >
            <Select
              id="energyRating"
              value={energyRating}
              onChange={(e) => setEnergyRating(e.target.value)}
            >
              <option value="">—</option>
              {ENERGY_RATINGS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Floor" htmlFor="floor" hint="For apartments. Optional.">
            <Input
              id="floor"
              type="number"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="3"
            />
          </Field>
          <Field label="Total floors" htmlFor="totalFloors">
            <Input
              id="totalFloors"
              type="number"
              min={0}
              value={totalFloors}
              onChange={(e) => setTotalFloors(e.target.value)}
              placeholder="5"
            />
          </Field>
          <Field label="Condition" htmlFor="condition">
            <Select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">—</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={parking}
              onChange={(e) => setParking(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Parking
          </label>
          <label className="flex items-center gap-3 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={elevator}
              onChange={(e) => setElevator(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Elevator
          </label>
          <label className="flex items-center gap-3 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={balcony}
              onChange={(e) => setBalcony(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Balcony / Terrace
          </label>
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Photos
        </h2>
        <ImageUploader value={images} onChange={setImages} />
      </Card>

      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Story
        </h2>
        <Field label="Description" htmlFor="description">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-28"
          />
        </Field>
        <Field
          label="Narrative (boutique mode)"
          htmlFor="narrative"
          hint="Evocative story shown on the boutique detail page. Optional."
        >
          <Textarea
            id="narrative"
            value={narrative ?? ""}
            onChange={(e) => setNarrative(e.target.value)}
            className="min-h-28"
          />
        </Field>
        <Field
          label="Features"
          htmlFor="features"
          hint="Comma-separated, e.g. Infinity pool, Sea view, Wine cellar."
        >
          <Input
            id="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </Field>
        <Field
          label="Virtual tour"
          htmlFor="videoUrl"
          hint="YouTube, Vimeo, or 360° tour URL. Embedded on the detail page. Optional."
        >
          <Input
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </Field>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Assignment & Map
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Agent" htmlFor="agent">
            <Select
              id="agent"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            >
              <option value="">— Unassigned —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Featured">
            <label className="flex h-[42px] items-center gap-3 text-sm text-cream/70">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Show in featured collections
            </label>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Latitude" htmlFor="lat" hint="For the map pin. Optional.">
            <Input
              id="lat"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="42.6407"
            />
          </Field>
          <Field label="Longitude" htmlFor="lng">
            <Input
              id="lng"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="18.1077"
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          SEO
        </h2>
        <Field
          label="Meta title"
          htmlFor="metaTitle"
          hint="Overrides the browser tab / search-result title. Falls back to the property title. ~60 characters."
        >
          <Input
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={70}
            placeholder="Villa Aurelia — Beachfront Villa in Dubrovnik"
          />
        </Field>
        <Field
          label="Meta description"
          htmlFor="metaDescription"
          hint="Search-result snippet. Falls back to the start of the description. ~155 characters."
        >
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            maxLength={200}
            className="min-h-20"
            placeholder="A rare beachfront villa with panoramic Adriatic views, infinity pool and private mooring in the heart of Dubrovnik."
          />
        </Field>
      </Card>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : editing ? "Save changes" : "Create property"}
        </Button>
        <button
          type="button"
          onClick={() => router.push("/admin/properties")}
          className="text-sm text-cream/50 hover:text-cream"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

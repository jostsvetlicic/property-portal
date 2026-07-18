import { PropertyCard } from "./PropertyCard";
import type { PropertyWithRelations } from "@/lib/queries";

/**
 * "Similar properties" row shown at the bottom of both detail modes. Renders
 * nothing when there are no related listings.
 */
export function SimilarProperties({
  properties,
  title,
  featuredLabel,
}: {
  properties: PropertyWithRelations[];
  title: string;
  featuredLabel?: string;
}) {
  if (properties.length === 0) return null;

  return (
    <div>
      <h2 className="text-center font-display text-3xl text-cream sm:text-4xl">
        {title}
      </h2>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} featuredLabel={featuredLabel} />
        ))}
      </div>
    </div>
  );
}

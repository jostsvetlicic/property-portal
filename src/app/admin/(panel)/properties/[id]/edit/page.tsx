import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getPropertyById, getAgents } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

/** Edit-property screen. */
export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, agents] = await Promise.all([
    getPropertyById(id),
    getAgents(),
  ]);
  if (!property) notFound();

  return (
    <div>
      <PageHeader
        title="Edit property"
        description={property.title}
        action={
          <div className="flex items-center gap-5">
            <Link
              href={`/properties/${property.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm text-cream/50 hover:text-accent"
            >
              <ExternalLink className="h-4 w-4" /> View live
            </Link>
            <DeleteButton
              endpoint={`/api/properties/${property.id}`}
              redirectTo="/admin/properties"
            />
          </div>
        }
      />
      <PropertyForm
        property={property}
        agents={agents.map((a) => ({ id: a.id, name: a.name }))}
      />
    </div>
  );
}

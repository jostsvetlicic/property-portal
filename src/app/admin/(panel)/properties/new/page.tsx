import { getAgents } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const dynamic = "force-dynamic";

/** New-property screen. */
export default async function NewPropertyPage() {
  const agents = await getAgents();
  return (
    <div>
      <PageHeader title="New property" description="Add a listing to the portfolio." />
      <PropertyForm agents={agents.map((a) => ({ id: a.id, name: a.name }))} />
    </div>
  );
}

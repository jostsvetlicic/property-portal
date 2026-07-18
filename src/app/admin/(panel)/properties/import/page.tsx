import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { CsvImporter } from "@/components/admin/CsvImporter";

export const dynamic = "force-dynamic";

/** Bulk CSV import screen. */
export default function ImportPropertiesPage() {
  return (
    <div>
      <PageHeader
        title="Import listings"
        description="Add many properties at once from a spreadsheet."
        action={
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-2 text-sm text-cream/50 transition hover:text-cream"
          >
            <ArrowLeft className="h-4 w-4" /> Back to properties
          </Link>
        }
      />
      <CsvImporter />
    </div>
  );
}

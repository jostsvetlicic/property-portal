import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Upload } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { PageHeader, Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle";

export const dynamic = "force-dynamic";

/** Admin properties list — cover thumb, key facts, edit/delete. */
export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      agent: { select: { name: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Properties"
        description={`${properties.length} listing${properties.length === 1 ? "" : "s"}`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/properties/import"
              className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-5 py-2.5 text-sm text-cream/80 transition hover:border-accent hover:text-accent"
            >
              <Upload className="h-4 w-4" /> Import CSV
            </Link>
            <Link
              href="/admin/properties/new"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-base transition hover:bg-accent-soft"
            >
              <Plus className="h-4 w-4" /> New property
            </Link>
          </div>
        }
      />

      {properties.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-cream/40">
            No properties yet.{" "}
            <Link href="/admin/properties/new" className="text-accent">
              Add your first listing.
            </Link>
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-cream/10 p-0">
          {properties.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-base">
                {p.images[0] && (
                  <Image
                    src={p.images[0].url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/properties/${p.id}/edit`}
                    className="truncate font-medium text-cream hover:text-accent"
                  >
                    {p.title}
                  </Link>
                </div>
                <div className="mt-0.5 truncate text-xs text-cream/45">
                  {p.location} · {p.type}
                  {p.agent ? ` · ${p.agent.name}` : ""}
                </div>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <div className="text-sm text-cream">{formatPrice(p.price)}</div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-widest",
                    p.status === "available"
                      ? "text-accent"
                      : p.status === "reserved"
                        ? "text-amber-400"
                        : "text-cream/40",
                  )}
                >
                  {p.status}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <FeaturedToggle id={p.id} featured={p.featured} />
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="inline-flex items-center gap-1.5 text-xs text-cream/50 transition hover:text-accent"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
                <DeleteButton endpoint={`/api/properties/${p.id}`} iconOnly />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { InquiriesList } from "@/components/admin/InquiriesList";

export const dynamic = "force-dynamic";

/** Admin inquiries — property + contact leads. */
export default async function AdminInquiriesPage() {
  const [inquiries, agents] = await Promise.all([
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: { property: { select: { title: true, slug: true } } },
    }),
    prisma.agent.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const unread = inquiries.filter((i) => !i.read).length;

  return (
    <div>
      <PageHeader
        title="Inquiries"
        description={
          unread > 0 ? `${unread} unread of ${inquiries.length}` : `${inquiries.length} total`
        }
      />
      <InquiriesList
        agents={agents}
        inquiries={inquiries.map((i) => ({
          id: i.id,
          name: i.name,
          email: i.email,
          phone: i.phone,
          message: i.message,
          source: i.source,
          status: i.status,
          agentId: i.agentId,
          read: i.read,
          createdAt: i.createdAt.toISOString(),
          propertyTitle: i.property?.title ?? null,
          propertySlug: i.property?.slug ?? null,
        }))}
      />
    </div>
  );
}

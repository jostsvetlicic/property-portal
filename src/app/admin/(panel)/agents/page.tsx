import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { AgentManager } from "@/components/admin/AgentManager";

export const dynamic = "force-dynamic";

/** Admin agents — list with inline create/edit/delete. */
export default async function AdminAgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { properties: true } } },
  });

  return (
    <div>
      <PageHeader title="Agents" description="Manage your advisory team." />
      <AgentManager
        agents={agents.map((a) => ({
          id: a.id,
          name: a.name,
          role: a.role,
          email: a.email,
          phone: a.phone,
          photoUrl: a.photoUrl,
          bio: a.bio,
          _count: a._count,
        }))}
      />
    </div>
  );
}

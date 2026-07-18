import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AgentCard } from "@/components/shared/AgentCard";
import { Reveal } from "@/components/shared/Reveal";
import { getAgents } from "@/lib/queries";
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = { title: "Agents" };

/** Agents page — grid of advisor profiles (shared across both modes). */
export default async function AgentsPage() {
  const [agents, { t }] = await Promise.all([getAgents(), getTranslations()]);

  return (
    <div className="pt-36">
      <Container className="pb-28">
        <SectionHeading
          align="center"
          eyebrow={t("nav.agents")}
          title={t("agents.title")}
          subtitle={t("agents.subtitle")}
        />

        <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent, i) => (
            <Reveal key={agent.id} delay={(i % 4) * 90}>
              <AgentCard agent={agent} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}

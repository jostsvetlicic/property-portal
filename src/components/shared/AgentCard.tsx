import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import type { Agent } from "@prisma/client";

/** Agent profile card used on the agents page and property detail sidebar. */
export function AgentCard({
  agent,
  variant = "full",
}: {
  agent: Agent;
  variant?: "full" | "compact";
}) {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-4 rounded-[var(--radius-base)] border border-cream/10 bg-cream/[0.03] p-4">
        {agent.photoUrl && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
            <Image
              src={agent.photoUrl}
              alt={agent.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-display text-lg text-cream">{agent.name}</p>
          <p className="text-xs uppercase tracking-widest text-accent">
            {agent.role}
          </p>
          <div className="mt-2 flex gap-3 text-xs text-cream/60">
            <a
              href={`mailto:${agent.email}`}
              className="flex items-center gap-1 hover:text-accent"
            >
              <Mail className="h-3 w-3" /> Email
            </a>
            {agent.phone && (
              <a
                href={`tel:${agent.phone}`}
                className="flex items-center gap-1 hover:text-accent"
              >
                <Phone className="h-3 w-3" /> Call
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group text-center">
      <div className="img-zoom relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-base)] bg-charcoal">
        {agent.photoUrl && (
          <Image
            src={agent.photoUrl}
            alt={agent.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <h3 className="mt-5 font-display text-xl text-cream">{agent.name}</h3>
      <p className="mt-1 text-xs uppercase tracking-widest text-accent">
        {agent.role}
      </p>
      {agent.bio && (
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-cream/55">
          {agent.bio}
        </p>
      )}
      <div className="mt-4 flex justify-center gap-4 text-sm text-cream/70">
        <a
          href={`mailto:${agent.email}`}
          className="flex items-center gap-1.5 hover:text-accent"
        >
          <Mail className="h-4 w-4 text-accent" /> {agent.email}
        </a>
      </div>
      {agent.phone && (
        <a
          href={`tel:${agent.phone}`}
          className="mt-1 flex items-center justify-center gap-1.5 text-sm text-cream/70 hover:text-accent"
        >
          <Phone className="h-4 w-4 text-accent" /> {agent.phone}
        </a>
      )}
    </div>
  );
}

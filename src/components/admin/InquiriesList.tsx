"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Home, Circle, CheckCircle2, UserRound } from "lucide-react";
import { Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { cn } from "@/lib/cn";

export type LeadStatus = "new" | "contacted" | "closed";

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string;
  status: string;
  agentId: string | null;
  read: boolean;
  createdAt: string;
  propertyTitle: string | null;
  propertySlug: string | null;
}

export interface AgentOption {
  id: string;
  name: string;
}

const STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-accent/15 text-accent",
  contacted: "bg-sky-400/15 text-sky-300",
  closed: "bg-cream/10 text-cream/50",
};

/** Leads table with status + agent assignment, read toggle and delete. */
export function InquiriesList({
  inquiries,
  agents,
}: {
  inquiries: InquiryRecord[];
  agents: AgentOption[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");

  const visible = inquiries.filter(
    (i) => filter === "all" || i.status === filter,
  );

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    contacted: inquiries.filter((i) => i.status === "contacted").length,
    closed: inquiries.filter((i) => i.status === "closed").length,
  } as const;

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  const toggleRead = (i: InquiryRecord) => patch(i.id, { read: !i.read });
  const setStatus = (i: InquiryRecord, status: LeadStatus) =>
    patch(i.id, { status });
  const setAgent = (i: InquiryRecord, agentId: string) =>
    patch(i.id, { agentId: agentId || null });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs uppercase tracking-widest transition",
              filter === f
                ? "bg-accent text-base"
                : "border border-cream/15 text-cream/50 hover:text-cream",
            )}
          >
            {f} <span className="opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-cream/15 py-12 text-center text-sm text-cream/35">
          No {filter === "all" ? "" : `${filter} `}inquiries.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((i) => (
            <Card
              key={i.id}
              className={cn(
                "flex flex-col gap-3",
                !i.read && "border-accent/30",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-cream">{i.name}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest",
                        i.source === "contact"
                          ? "bg-cream/10 text-cream/60"
                          : "bg-accent/15 text-accent",
                      )}
                    >
                      {i.source}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest",
                        STATUS_STYLES[i.status as LeadStatus] ??
                          "bg-cream/10 text-cream/50",
                      )}
                    >
                      {i.status}
                    </span>
                    {!i.read && (
                      <span className="text-[10px] uppercase tracking-widest text-accent">
                        Unread
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream/50">
                    <a
                      href={`mailto:${i.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-accent"
                    >
                      <Mail className="h-3 w-3" /> {i.email}
                    </a>
                    {i.phone && (
                      <a
                        href={`tel:${i.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-accent"
                      >
                        <Phone className="h-3 w-3" /> {i.phone}
                      </a>
                    )}
                    {i.propertyTitle && (
                      <span className="inline-flex items-center gap-1.5">
                        <Home className="h-3 w-3" /> {i.propertyTitle}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-cream/35">
                  {new Date(i.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-relaxed text-cream/70">
                {i.message}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-cream/10 pt-3">
                {/* Status */}
                <div className="flex items-center gap-1 rounded-full border border-cream/15 p-1">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(i, s)}
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] uppercase tracking-widest transition",
                        i.status === s
                          ? "bg-accent text-base"
                          : "text-cream/45 hover:text-cream",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Agent assignment */}
                <label className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-cream/5 px-3 py-1.5 text-xs text-cream/70 focus-within:border-accent">
                  <UserRound className="h-3.5 w-3.5 text-accent" />
                  <select
                    aria-label="Assign agent"
                    value={i.agentId ?? ""}
                    onChange={(e) => setAgent(i, e.target.value)}
                    className="bg-transparent pr-1 text-xs text-cream focus:outline-none [&>option]:text-base"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  onClick={() => toggleRead(i)}
                  className="inline-flex items-center gap-1.5 text-xs text-cream/50 transition hover:text-accent"
                >
                  {i.read ? (
                    <>
                      <Circle className="h-3.5 w-3.5" /> Mark unread
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark read
                    </>
                  )}
                </button>
                <DeleteButton endpoint={`/api/inquiries/${i.id}`} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

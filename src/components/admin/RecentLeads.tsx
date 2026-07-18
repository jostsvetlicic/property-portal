"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

export type LeadStatus = "new" | "contacted" | "closed";

const STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-accent/15 text-accent",
  contacted: "bg-sky-400/15 text-sky-300",
  closed: "bg-cream/10 text-cream/50",
};

export interface RecentLead {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  propertyTitle: string | null;
}

/**
 * Dashboard recent-leads panel — triage the newest inquiries inline by marking
 * them new / contacted / closed (persisted via PATCH /api/inquiries/[id]).
 */
export function RecentLeads({ leads }: { leads: RecentLead[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: LeadStatus) {
    setBusyId(id);
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  if (leads.length === 0) {
    return (
      <Card>
        <p className="text-sm text-cream/40">No inquiries yet.</p>
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-cream/10 p-0">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className={cn(
            "flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 py-4 transition",
            busyId === lead.id && "opacity-50",
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium text-cream">
                {lead.name}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest",
                  STATUS_STYLES[lead.status as LeadStatus] ??
                    "bg-cream/10 text-cream/50",
                )}
              >
                {lead.status}
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-cream/45">
              {lead.propertyTitle
                ? `Re: ${lead.propertyTitle}`
                : "General inquiry"}{" "}
              · {lead.email}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-full border border-cream/15 p-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(lead.id, s)}
                disabled={busyId === lead.id}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] uppercase tracking-widest transition disabled:cursor-not-allowed",
                  lead.status === s
                    ? "bg-accent text-base"
                    : "text-cream/45 hover:text-cream",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}

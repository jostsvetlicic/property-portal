"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, User } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card, Field, Input, Textarea } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";

export interface AgentRecord {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  bio: string | null;
  _count?: { properties: number };
}

const EMPTY: AgentRecord = {
  id: "",
  name: "",
  role: "",
  email: "",
  phone: "",
  photoUrl: "",
  bio: "",
};

/** List + inline create/edit form for agents. */
export function AgentManager({ agents }: { agents: AgentRecord[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AgentRecord | null>(null);

  return (
    <div className="space-y-8">
      {editing ? (
        <AgentEditor
          agent={editing}
          onDone={() => {
            setEditing(null);
            router.refresh();
          }}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div className="flex justify-end">
          <Button onClick={() => setEditing(EMPTY)}>
            <Plus className="h-4 w-4" /> Add agent
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {agents.map((a) => (
          <Card key={a.id} className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-cream/10 bg-base">
              {a.photoUrl ? (
                <Image
                  src={a.photoUrl}
                  alt={a.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-cream/30">
                  <User className="h-6 w-6" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-cream">{a.name}</div>
              <div className="text-sm text-accent">{a.role}</div>
              <div className="mt-1 truncate text-xs text-cream/40">
                {a.email}
              </div>
              {a._count && (
                <div className="mt-1 text-xs text-cream/40">
                  {a._count.properties} listing
                  {a._count.properties === 1 ? "" : "s"}
                </div>
              )}
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => setEditing({ ...a })}
                  className="inline-flex items-center gap-1.5 text-xs text-cream/50 transition hover:text-accent"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <DeleteButton endpoint={`/api/agents/${a.id}`} />
              </div>
            </div>
          </Card>
        ))}
        {agents.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-cream/15 py-12 text-center text-sm text-cream/35">
            No agents yet.
          </p>
        )}
      </div>
    </div>
  );
}

function AgentEditor({
  agent,
  onDone,
  onCancel,
}: {
  agent: AgentRecord;
  onDone: () => void;
  onCancel: () => void;
}) {
  const editing = Boolean(agent.id);
  const [form, setForm] = useState(agent);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof AgentRecord>(key: K, val: AgentRecord[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function save() {
    setError(null);
    setSaving(true);
    const url = editing ? `/api/agents/${agent.id}` : "/api/agents";
    try {
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Save failed.");
        setSaving(false);
        return;
      }
      onDone();
    } catch {
      setError("Network error.");
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-5">
      <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
        {editing ? "Edit agent" : "New agent"}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Role">
          <Input
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Senior Advisor"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Photo URL" hint="Paste a portrait image URL.">
        <Input
          value={form.photoUrl ?? ""}
          onChange={(e) => set("photoUrl", e.target.value)}
        />
      </Field>
      <Field label="Bio">
        <Textarea
          value={form.bio ?? ""}
          onChange={(e) => set("bio", e.target.value)}
        />
      </Field>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : editing ? "Save changes" : "Create agent"}
        </Button>
        <button
          onClick={onCancel}
          className="text-sm text-cream/50 hover:text-cream"
        >
          Cancel
        </button>
      </div>
    </Card>
  );
}

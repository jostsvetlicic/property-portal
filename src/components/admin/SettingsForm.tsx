"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, Field, Input } from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import type { Mode } from "@/types";

export interface SettingsValues {
  mode: Mode;
  name: string;
  logoText: string;
  tagline: string;
  accentColor: string;
  baseColor: string;
  creamColor: string;
  email: string;
  phone: string;
  address: string;
}

/** Live-editable branding + mode settings (writes the DB Settings row). */
export function SettingsForm({ initial }: { initial: SettingsValues }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SettingsValues>(k: K, v: SettingsValues[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Save failed.");
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      router.refresh();
    } catch {
      setError("Network error.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Front-end mode
        </h2>
        <p className="text-sm text-cream/50">
          Switches the entire public experience. Changes apply instantly.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              {
                value: "portal",
                title: "Portal",
                desc: "High-volume marketplace. Prominent search, filters, map. Built for hundreds of listings.",
              },
              {
                value: "boutique",
                title: "Boutique",
                desc: "Curated ultra-luxury. Cinematic cards, storytelling, minimal search. For trophy collections.",
              },
            ] as const
          ).map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => set("mode", opt.value)}
              className={cn(
                "rounded-[var(--radius-base)] border p-5 text-left transition",
                form.mode === opt.value
                  ? "border-accent bg-accent/10"
                  : "border-cream/15 hover:border-cream/30",
              )}
            >
              <div className="font-display text-lg text-cream">{opt.title}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-cream/50">
                {opt.desc}
              </p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Brand
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Agency name">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Logo text">
            <Input
              value={form.logoText}
              onChange={(e) => set("logoText", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Tagline">
          <Input
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </Field>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Colors
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <ColorField
            label="Accent"
            value={form.accentColor}
            onChange={(v) => set("accentColor", v)}
          />
          <ColorField
            label="Base"
            value={form.baseColor}
            onChange={(v) => set("baseColor", v)}
          />
          <ColorField
            label="Cream"
            value={form.creamColor}
            onChange={(v) => set("creamColor", v)}
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Contact
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email">
            <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
        </div>
        <Field label="Address">
          <Input
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </Field>
      </Card>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
        {saved && <span className="text-sm text-accent">Saved.</span>}
      </div>
    </form>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded border border-cream/15 bg-transparent"
          aria-label={`${label} color picker`}
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface InquiryLabels {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  messagePlaceholder?: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
}

type Status = "idle" | "sending" | "success" | "error";

/**
 * Lead capture form used on property detail pages (source = "property") and,
 * in a simplified variant, on the contact page. Posts to /api/inquiries which
 * persists the lead to the database.
 */
export function InquiryForm({
  labels,
  propertyId,
  source = "property",
  compact = false,
}: {
  labels: InquiryLabels;
  propertyId?: string;
  source?: "property" | "contact";
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, propertyId, source }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-base)] border border-accent/30 bg-accent/10 p-8 text-center">
        <p className="font-display text-xl text-accent">{labels.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!compact && (
        <div>
          <h3 className="font-display text-2xl text-cream">{labels.title}</h3>
          <p className="mt-1 text-sm text-cream/55">{labels.subtitle}</p>
        </div>
      )}

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <FormField label={labels.name} name="name" required />
        <FormField label={labels.email} name="email" type="email" required />
      </div>
      <FormField label={labels.phone} name="phone" type="tel" />
      <FormField
        label={labels.message}
        name="message"
        as="textarea"
        placeholder={labels.messagePlaceholder}
        required
      />

      {status === "error" && (
        <p className="text-sm text-red-400">{labels.error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-medium tracking-wide text-base transition-all hover:bg-accent-soft disabled:opacity-60"
      >
        {status === "sending" ? labels.sending : labels.submit}
      </button>
    </form>
  );
}

function FormField({
  label,
  name,
  type = "text",
  as = "input",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  required?: boolean;
  placeholder?: string;
}) {
  const shared =
    "w-full rounded-[var(--radius-base)] border border-cream/15 bg-cream/5 px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-cream/50">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={4}
          placeholder={placeholder}
          className={cn(shared, "resize-none")}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={shared}
        />
      )}
    </label>
  );
}

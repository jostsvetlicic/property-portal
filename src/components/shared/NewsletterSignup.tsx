"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export interface NewsletterLabels {
  heading: string;
  description: string;
  placeholder: string;
  submit: string;
  success: string;
  error: string;
}

type Status = "idle" | "sending" | "success" | "error";

/**
 * Footer newsletter subscription. Posts an email to /api/newsletter, which
 * upserts a NewsletterSubscriber. The current locale is sent so the agency can
 * segment its market-insights mailing list.
 */
export function NewsletterSignup({
  labels,
  locale,
}: {
  labels: NewsletterLabels;
  locale: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const email = new FormData(form).get("email");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
        {labels.description}
      </p>
      {status === "success" ? (
        <p className="mt-4 text-sm text-accent">{labels.success}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 max-w-xs">
          <div className="flex items-center rounded-full border border-cream/15 bg-cream/5 pr-1 transition focus-within:border-accent">
            <input
              type="email"
              name="email"
              required
              placeholder={labels.placeholder}
              aria-label={labels.heading}
              className="w-full bg-transparent px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              aria-label={labels.submit}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-base transition-all hover:bg-accent-soft disabled:opacity-60"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {status === "error" && (
            <p className="mt-2 text-xs text-red-400">{labels.error}</p>
          )}
        </form>
      )}
    </div>
  );
}

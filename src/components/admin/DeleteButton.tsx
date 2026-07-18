"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Confirm-then-DELETE button. Shows an inline confirm state (no browser
 * confirm dialog), then calls the endpoint and refreshes the route.
 */
export function DeleteButton({
  endpoint,
  redirectTo,
  label = "Delete",
  className,
  iconOnly = false,
}: {
  endpoint: string;
  redirectTo?: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setError(null);
    const res = await fetch(endpoint, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Delete failed.");
      setConfirming(false);
      return;
    }
    startTransition(() => {
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        <button
          onClick={onDelete}
          disabled={pending}
          className="rounded-md bg-red-500/90 px-2.5 py-1 font-medium text-white hover:bg-red-500 disabled:opacity-50"
        >
          {pending ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="rounded-md px-2 py-1 text-cream/50 hover:text-cream"
        >
          Cancel
        </button>
        {error && <span className="text-red-400">{error}</span>}
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-cream/50 transition hover:text-red-400",
        className,
      )}
      aria-label={label}
    >
      <Trash2 className="h-3.5 w-3.5" />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}

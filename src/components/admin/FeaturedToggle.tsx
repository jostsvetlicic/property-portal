"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/** One-click featured toggle for the admin properties list. */
export function FeaturedToggle({
  id,
  featured,
}: {
  id: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [on, setOn] = useState(featured);
  const [pending, start] = useTransition();

  function toggle() {
    const next = !on;
    setOn(next); // optimistic
    start(async () => {
      const res = await fetch(`/api/properties/${id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: next }),
      });
      if (!res.ok) {
        setOn(!next); // revert on failure
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={on}
      title={on ? "Featured — click to unfeature" : "Click to feature"}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs transition disabled:opacity-50",
        on ? "text-accent" : "text-cream/40 hover:text-accent",
      )}
    >
      <Star className={cn("h-3.5 w-3.5", on && "fill-accent")} />
      <span className="hidden sm:inline">{on ? "Featured" : "Feature"}</span>
    </button>
  );
}

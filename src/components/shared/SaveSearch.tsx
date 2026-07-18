"use client";

import { useState } from "react";
import { BookmarkPlus, Check } from "lucide-react";
import { addSavedSearch } from "@/lib/saved-searches";

export interface SaveSearchLabels {
  save: string; // "Save search"
  saved: string; // "Saved"
  namePlaceholder: string; // "Name this search"
  confirm: string; // "Save"
}

/**
 * Saves the current filter querystring under a name to localStorage, so the
 * visitor can revisit it from the Saved searches page. Opens a tiny inline
 * form; no account required.
 */
export function SaveSearch({
  query,
  labels,
}: {
  query: string;
  labels: SaveSearchLabels;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addSavedSearch(name, query);
    setName("");
    setOpen(false);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
        <Check className="h-4 w-4" />
        {labels.saved}
      </span>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/70 transition hover:border-accent hover:text-accent"
      >
        <BookmarkPlus className="h-4 w-4" />
        {labels.save}
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={labels.namePlaceholder}
        className="w-44 rounded-full border border-cream/15 bg-cream/5 px-4 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-base transition hover:bg-accent-soft"
      >
        {labels.confirm}
      </button>
    </form>
  );
}

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, ArrowUp, ArrowDown, Link2 } from "lucide-react";

export interface ImageItem {
  url: string;
  alt?: string | null;
}

/**
 * Ordered image manager for the property form.
 *
 * Two ways to add: upload a file (→ Vercel Blob via /api/upload) or paste an
 * image URL (useful locally without a Blob token, and for CDN photography).
 * Supports reorder + remove. First image is the cover.
 */
export function ImageUploader({
  value,
  onChange,
}: {
  value: ImageItem[];
  onChange: (next: ImageItem[]) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const added: ImageItem[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = (await res.json().catch(() => ({}))) as {
          url?: string;
          error?: string;
        };
        if (!res.ok || !data.url) {
          setError(data.error ?? "Upload failed.");
          break;
        }
        added.push({ url: data.url, alt: null });
      }
      if (added.length) onChange([...value, ...added]);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setError("Enter a valid image URL (http/https).");
      return;
    }
    setError(null);
    onChange([...value, { url, alt: null }]);
    setUrlDraft("");
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-cream/15 bg-base/60 px-4 py-2.5 text-sm text-cream transition hover:border-accent disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading…" : "Upload photos"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />

        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-cream/15 bg-base/60 px-3 py-2">
            <Link2 className="h-4 w-4 shrink-0 text-cream/40" />
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="…or paste an image URL"
              className="w-full bg-transparent text-sm text-cream outline-none placeholder:text-cream/30"
            />
          </div>
          <button
            type="button"
            onClick={addUrl}
            className="rounded-lg border border-cream/15 px-3 py-2 text-sm text-cream/70 transition hover:border-accent hover:text-accent"
          >
            Add
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {value.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((img, i) => (
            <div
              key={`${img.url}-${i}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-cream/10"
            >
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                sizes="200px"
                className="object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-base">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/80 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    className="rounded bg-white/10 p-1 text-white hover:bg-white/20"
                    aria-label="Move left"
                  >
                    <ArrowUp className="h-3 w-3 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    className="rounded bg-white/10 p-1 text-white hover:bg-white/20"
                    aria-label="Move right"
                  >
                    <ArrowDown className="h-3 w-3 -rotate-90" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded bg-red-500/80 p-1 text-white hover:bg-red-500"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-cream/15 py-8 text-center text-sm text-cream/35">
          No photos yet. Upload files or paste image URLs above.
        </p>
      )}
    </div>
  );
}

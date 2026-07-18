"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/admin/ui";
import { parseCsv } from "@/lib/csv";
import {
  IMPORT_COLUMNS,
  buildTemplateCsv,
  isTemplateExampleRow,
} from "@/lib/property-csv";

interface ImportResult {
  created: number;
  skipped: number;
  failed: number;
  total: number;
  errors: { row: number; message: string }[];
}

interface Preview {
  fileName: string;
  csv: string;
  dataRows: number;
  headers: string[];
  missing: string[];
}

const REQUIRED = IMPORT_COLUMNS.filter((c) => c.required).map((c) => c.key);

/** Admin CSV bulk-import: download template, preview a file, import many. */
export function CsvImporter() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);

  function downloadTemplate() {
    const blob = new Blob([buildTemplateCsv()], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "property-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const { headers, rows } = parseCsv(text);

    if (headers.length === 0 || rows.length === 0) {
      setPreview(null);
      setError("That file has no data rows.");
      return;
    }

    const missing = REQUIRED.filter((k) => !headers.includes(k));
    const realRows = rows.filter((r) => !isTemplateExampleRow(r));

    setPreview({
      fileName: file.name,
      csv: text,
      dataRows: realRows.length,
      headers,
      missing,
    });
  }

  function reset() {
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function runImport() {
    if (!preview) return;
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/properties/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: preview.csv }),
      });
      const data = (await res.json().catch(() => ({}))) as
        | ImportResult
        | { error?: string };
      if (!res.ok) {
        setError(("error" in data && data.error) || "Import failed.");
        setImporting(false);
        return;
      }
      setResult(data as ImportResult);
      if ((data as ImportResult).created > 0) router.refresh();
    } catch {
      setError("Network error. Please try again.");
    }
    setImporting(false);
  }

  return (
    <div className="space-y-6">
      {/* Step 1 — template */}
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
            1 · Get the template
          </h2>
          <p className="mt-1 text-sm text-cream/50">
            Download the CSV, fill one row per listing, then upload it below.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-5 py-2.5 text-sm text-cream/80 transition hover:border-accent hover:text-accent"
        >
          <Download className="h-4 w-4" /> Download template
        </button>
      </Card>

      {/* Step 2 — upload */}
      <Card className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          2 · Upload your CSV
        </h2>

        {!preview ? (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-base)] border border-dashed border-cream/20 px-6 py-12 text-center transition hover:border-accent/50">
            <Upload className="h-7 w-7 text-accent" />
            <span className="text-sm text-cream/70">
              Choose a .csv file or drag it here
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={onFile}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-cream/10 bg-base/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-accent" />
              <div>
                <div className="text-sm text-cream">{preview.fileName}</div>
                <div className="text-xs text-cream/45">
                  {preview.dataRows} listing
                  {preview.dataRows === 1 ? "" : "s"} ready to import
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-cream/50 transition hover:text-cream"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        )}

        {preview && preview.missing.length > 0 && (
          <p className="flex items-center gap-2 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4" /> Missing required column
            {preview.missing.length === 1 ? "" : "s"}:{" "}
            {preview.missing.join(", ")}
          </p>
        )}

        {error && (
          <p className="flex items-center gap-2 text-sm text-red-400" role="alert">
            <AlertTriangle className="h-4 w-4" /> {error}
          </p>
        )}

        {preview && (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={runImport}
              disabled={
                importing || preview.missing.length > 0 || preview.dataRows === 0
              }
            >
              {importing
                ? "Importing…"
                : `Import ${preview.dataRows} listing${preview.dataRows === 1 ? "" : "s"}`}
            </Button>
          </div>
        )}
      </Card>

      {/* Results */}
      {result && (
        <Card className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
            Import complete
          </h2>
          <div className="flex flex-wrap gap-6">
            <Stat
              label="Created"
              value={result.created}
              tone="good"
            />
            {result.skipped > 0 && (
              <Stat label="Skipped" value={result.skipped} />
            )}
            {result.failed > 0 && (
              <Stat label="Failed" value={result.failed} tone="bad" />
            )}
          </div>

          {result.created > 0 && (
            <p className="flex items-center gap-2 text-sm text-cream/70">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              {result.created} listing{result.created === 1 ? "" : "s"} added to
              your portfolio.
            </p>
          )}

          {result.errors.length > 0 && (
            <div className="rounded-lg border border-red-400/20 bg-red-400/5 p-4">
              <p className="mb-2 text-xs uppercase tracking-widest text-red-400/80">
                Rows that couldn&apos;t be imported
              </p>
              <ul className="space-y-1 text-sm text-cream/70">
                {result.errors.map((er) => (
                  <li key={er.row}>
                    <span className="text-cream/45">Row {er.row}:</span>{" "}
                    {er.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={reset}
              className="text-sm text-accent hover:text-accent-soft"
            >
              Import another file
            </button>
          </div>
        </Card>
      )}

      {/* Column reference */}
      <Card className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
          Column reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-cream/40">
                <th className="py-2 pr-4 font-normal">Column</th>
                <th className="py-2 pr-4 font-normal">Notes</th>
                <th className="py-2 font-normal">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/10">
              {IMPORT_COLUMNS.map((c) => (
                <tr key={c.key} className="align-top">
                  <td className="whitespace-nowrap py-2 pr-4 font-mono text-cream">
                    {c.key}
                    {c.required && <span className="text-accent"> *</span>}
                  </td>
                  <td className="py-2 pr-4 text-cream/60">{c.hint}</td>
                  <td className="py-2 text-cream/40">{c.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-cream/35">
          <span className="text-accent">*</span> required · features and images
          accept multiple values separated by a semicolon (;)
        </p>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "good" | "bad";
}) {
  return (
    <div>
      <div
        className={
          tone === "good"
            ? "text-3xl font-light text-accent"
            : tone === "bad"
              ? "text-3xl font-light text-red-400"
              : "text-3xl font-light text-cream"
        }
      >
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-cream/45">
        {label}
      </div>
    </div>
  );
}

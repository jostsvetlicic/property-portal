/**
 * Tiny dependency-free CSV utilities shared by the client importer (preview)
 * and the server import route (authoritative). Handles quoted fields, escaped
 * double-quotes ("") and both LF and CRLF line endings — enough for the
 * spreadsheets an agency will export from Excel / Google Sheets / Numbers.
 */

/** Parses CSV text into a header row + array of field arrays. */
export function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  // Strip a leading UTF-8 BOM if present (common from Excel exports).
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];

    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++; // skip the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      // Handle CRLF as a single break.
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }

  // Flush the trailing field/row (files without a final newline).
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * Parses CSV into objects keyed by header. Blank lines are skipped. Values are
 * trimmed. Returns the raw header order too so callers can validate columns.
 */
export function parseCsv(text: string): {
  headers: string[];
  rows: Record<string, string>[];
} {
  const raw = parseCsvRows(text).filter(
    (r) => !(r.length === 1 && r[0].trim() === ""),
  );
  if (raw.length === 0) return { headers: [], rows: [] };

  const headers = raw[0].map((h) => h.trim());
  const rows = raw.slice(1).map((cells) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (cells[i] ?? "").trim();
    });
    return obj;
  });

  return { headers, rows };
}

/** Escapes a single value for CSV output, quoting only when necessary. */
function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Serializes an array of string rows back into CSV text (CRLF line endings). */
export function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map(escapeCsv).join(",")).join("\r\n");
}

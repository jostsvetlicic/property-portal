import { put, del } from "@vercel/blob";

/**
 * Thin wrapper around Vercel Blob for property photo storage.
 *
 * Requires BLOB_READ_WRITE_TOKEN. On Vercel the token is injected automatically
 * once a Blob store is linked; locally, set it in `.env` to test uploads.
 */

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Uploads a file and returns its public URL. */
export async function uploadImage(
  file: File,
): Promise<{ url: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const key = `properties/${crypto.randomUUID()}.${ext}`;
  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
  });
  return { url: blob.url };
}

/** Deletes a blob by URL (best-effort; ignores errors for non-blob URLs). */
export async function deleteImage(url: string): Promise<void> {
  if (!url.includes("blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch {
    // Non-fatal — the DB record removal is what matters for the UI.
  }
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImage, isBlobConfigured } from "@/lib/blob";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** POST /api/upload — admin-only image upload to Vercel Blob. */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      {
        error:
          "Image uploads are not configured. Set BLOB_READ_WRITE_TOKEN in your environment.",
      },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP or AVIF." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 8MB)." },
      { status: 413 },
    );
  }

  const { url } = await uploadImage(file);
  return NextResponse.json({ url });
}

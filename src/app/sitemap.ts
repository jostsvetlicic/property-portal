import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

/** Public site base URL (set NEXT_PUBLIC_SITE_URL in production). */
function baseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl();
  const staticPaths = ["", "/listings", "/agents", "/about", "/contact"];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  try {
    const properties = await prisma.property.findMany({
      select: { slug: true, updatedAt: true },
    });
    for (const p of properties) {
      entries.push({
        url: `${base}/properties/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // DB unavailable at build time — static routes still ship.
  }

  return entries;
}

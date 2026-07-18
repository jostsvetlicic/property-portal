import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile lives in the home
  // directory, which would otherwise be inferred as the root).
  outputFileTracingRoot: __dirname,
  images: {
    // Remote image hosts. Add your Vercel Blob store host (see README) and any
    // CDN you use for property photography.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;

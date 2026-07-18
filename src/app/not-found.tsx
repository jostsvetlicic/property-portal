import Link from "next/link";
import { getSettings } from "@/lib/settings";

/** Branded 404 page. */
export default async function NotFound() {
  const settings = await getSettings();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base px-6 text-center">
      <div className="font-display text-xs tracking-[0.3em] text-cream/40">
        {settings.logoText}
      </div>
      <div className="mt-8 font-display text-7xl text-accent">404</div>
      <h1 className="mt-4 font-display text-2xl text-cream">
        This page could not be found
      </h1>
      <p className="mt-3 max-w-sm text-sm text-cream/50">
        The address may be mistyped, or the property may no longer be available.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-base transition hover:bg-accent-soft"
      >
        Return home
      </Link>
    </main>
  );
}

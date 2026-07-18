import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin — Sign in" };

/** Admin sign-in page. Middleware sends authenticated users to /admin. */
export default async function LoginPage() {
  const settings = await getSettings();

  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="font-display text-lg tracking-[0.25em] text-cream">
            {settings.logoText}
          </div>
          <p className="mt-2 text-xs uppercase tracking-widest text-cream/40">
            Admin Console
          </p>
        </div>

        <div className="mt-10 rounded-[var(--radius-base)] border border-cream/10 bg-charcoal/60 p-8">
          <LoginForm />
        </div>

        <p className="mt-8 text-center text-xs text-cream/30">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </main>
  );
}

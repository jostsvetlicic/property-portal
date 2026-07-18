import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * Admin shell. Middleware already blocks unauthenticated access, but we
 * re-check the session here (defense in depth) before rendering any data.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [settings, unreadCount] = await Promise.all([
    getSettings(),
    prisma.inquiry.count({ where: { read: false } }),
  ]);

  return (
    <div className="min-h-screen bg-base text-cream md:flex">
      <AdminSidebar logoText={settings.logoText} unreadCount={unreadCount} />
      <div className="min-w-0 flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Home, Inbox, CalendarClock, Star, Plus, ArrowRight, Eye } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatPriceCompact } from "@/lib/format";
import { Card, PageHeader } from "@/components/admin/ui";
import { RecentLeads } from "@/components/admin/RecentLeads";

export const dynamic = "force-dynamic";

/** Admin dashboard — at-a-glance stats + quick actions + recent inquiries. */
export default async function AdminDashboard() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    settings,
    propertyCount,
    inquiryCount,
    unreadCount,
    weekInquiryCount,
    featuredCount,
    valueAgg,
    mostViewed,
    recent,
  ] = await Promise.all([
    getSettings(),
    prisma.property.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { read: false } }),
    prisma.inquiry.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.property.count({ where: { featured: true } }),
    prisma.property.aggregate({ _sum: { price: true } }),
    prisma.property.findMany({
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, slug: true, title: true, location: true, views: true },
    }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { property: { select: { title: true } } },
    }),
  ]);

  const stats = [
    { label: "Properties", value: propertyCount, icon: Home, href: "/admin/properties" },
    {
      label: "Inquiries",
      value: inquiryCount,
      sub: unreadCount > 0 ? `${unreadCount} unread` : undefined,
      icon: Inbox,
      href: "/admin/inquiries",
    },
    {
      label: "This week",
      value: weekInquiryCount,
      sub: "new leads",
      icon: CalendarClock,
      href: "/admin/inquiries",
    },
    { label: "Featured", value: featuredCount, icon: Star, href: "/admin/properties" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`${settings.name} · ${settings.mode} mode`}
        action={
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-base transition hover:bg-accent-soft"
          >
            <Plus className="h-4 w-4" /> New property
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="transition hover:border-accent/40">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-light text-cream">
                      {s.value}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-cream/45">
                      {s.label}
                    </div>
                    {s.sub && (
                      <div className="mt-1 text-xs text-accent">{s.sub}</div>
                    )}
                  </div>
                  <Icon className="h-5 w-5 text-accent/70" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-4">
        <Card>
          <div className="text-xs uppercase tracking-widest text-cream/45">
            Total portfolio value
          </div>
          <div className="mt-1 font-display text-3xl text-cream">
            {formatPriceCompact(valueAgg._sum.price ?? 0)}
          </div>
        </Card>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-cream">Most viewed</h2>
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-soft"
          >
            All properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {mostViewed.length === 0 || mostViewed.every((p) => p.views === 0) ? (
          <Card>
            <p className="text-sm text-cream/40">
              No property views recorded yet.
            </p>
          </Card>
        ) : (
          <Card className="divide-y divide-cream/10 p-0">
            {mostViewed.map((p, idx) => (
              <Link
                key={p.id}
                href={`/properties/${p.slug}`}
                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-cream/5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="font-display text-lg text-cream/30">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-cream">
                      {p.title}
                    </div>
                    <div className="truncate text-xs text-cream/45">
                      {p.location}
                    </div>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-accent">
                  <Eye className="h-4 w-4" /> {p.views}
                </span>
              </Link>
            ))}
          </Card>
        )}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-cream">Recent leads</h2>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-soft"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <RecentLeads
          leads={recent.map((i) => ({
            id: i.id,
            name: i.name,
            email: i.email,
            status: i.status,
            createdAt: i.createdAt.toISOString(),
            propertyTitle: i.property?.title ?? null,
          }))}
        />
      </div>
    </div>
  );
}

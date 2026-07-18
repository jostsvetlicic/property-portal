"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Users,
  Inbox,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const items: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Properties", icon: Home },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminSidebar({
  logoText,
  unreadCount,
}: {
  logoText: string;
  unreadCount: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex-1 space-y-1 px-3 py-6">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-accent/15 text-accent"
                : "text-cream/60 hover:bg-cream/5 hover:text-cream",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
            {item.href === "/admin/inquiries" && unreadCount > 0 && (
              <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-base">
                {unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-1 border-t border-cream/10 px-3 py-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream"
      >
        <ExternalLink className="h-4 w-4 shrink-0" />
        <span>View site</span>
      </Link>
      <button
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span>Sign out</span>
      </button>
    </div>
  );

  const brand = (
    <div className="border-b border-cream/10 px-6 py-6">
      <div className="font-display text-sm tracking-[0.22em] text-cream">
        {logoText}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-cream/35">
        Admin Console
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-cream/10 bg-charcoal md:flex">
        {brand}
        {nav}
        {footer}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-cream/10 bg-charcoal px-4 py-3 md:hidden">
        <div className="font-display text-sm tracking-[0.22em] text-cream">
          {logoText}
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-1.5 text-cream/70 hover:text-cream"
        >
          <Menu className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-3 top-2 h-2 w-2 rounded-full bg-accent" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-charcoal shadow-xl">
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
              <div className="font-display text-sm tracking-[0.22em] text-cream">
                {logoText}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-cream/60 hover:text-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            {footer}
          </div>
        </div>
      )}
    </>
  );
}

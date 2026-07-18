"use client";

import { useState } from "react";
import { Mail, Link2, Check, MessageCircle } from "lucide-react";

export interface ShareLabels {
  share: string;
  whatsapp: string;
  email: string;
  copy: string;
  copied: string;
}

/**
 * Share row for the property detail page. Builds share targets from the live
 * URL on the client, so it works regardless of host/locale.
 */
export function ShareButtons({
  title,
  labels,
}: {
  title: string;
  labels: ShareLabels;
}) {
  const [copied, setCopied] = useState(false);

  const url = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const whatsapp = () => {
    const text = encodeURIComponent(`${title} — ${url()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const email = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${title}\n\n${url()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs uppercase tracking-widest text-cream/45">
        {labels.share}
      </span>
      <Btn onClick={whatsapp} icon={<MessageCircle className="h-4 w-4" />}>
        {labels.whatsapp}
      </Btn>
      <Btn onClick={email} icon={<Mail className="h-4 w-4" />}>
        {labels.email}
      </Btn>
      <Btn
        onClick={copy}
        icon={
          copied ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Link2 className="h-4 w-4" />
          )
        }
      >
        {copied ? labels.copied : labels.copy}
      </Btn>
    </div>
  );
}

function Btn({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/75 transition hover:border-accent/50 hover:text-accent"
    >
      {icon}
      {children}
    </button>
  );
}

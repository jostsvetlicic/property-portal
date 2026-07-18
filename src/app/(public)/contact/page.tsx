import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { InquiryForm, type InquiryLabels } from "@/components/shared/InquiryForm";
import { MapViewDynamic } from "@/components/shared/MapViewDynamic";
import { Reveal } from "@/components/shared/Reveal";
import { getSettings } from "@/lib/settings";
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = { title: "Contact" };

/** Contact page — form saves to the DB (source = "contact") + office details. */
export default async function ContactPage() {
  const [settings, { t }] = await Promise.all([
    getSettings(),
    getTranslations(),
  ]);
  const { contact } = settings;

  const labels: InquiryLabels = {
    title: t("contact.title"),
    subtitle: t("contact.subtitle"),
    name: t("contact.name"),
    email: t("contact.email"),
    phone: t("contact.phone"),
    message: t("contact.message"),
    submit: t("contact.submit"),
    sending: t("contact.sending"),
    success: t("contact.success"),
    error: t("contact.error"),
  };

  return (
    <div className="pt-36">
      <Container className="pb-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Info */}
          <div>
            <p className="eyebrow text-accent">{t("nav.contact")}</p>
            <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">
              {t("contact.title")}
            </h1>
            <p className="mt-4 max-w-md text-lg text-cream/60">
              {t("contact.subtitle")}
            </p>

            <div className="mt-12 space-y-8">
              <ContactRow
                icon={<MapPin className="h-5 w-5 text-accent" />}
                label={t("contact.office")}
                value={contact.address}
              />
              <ContactRow
                icon={<Phone className="h-5 w-5 text-accent" />}
                label={t("contact.callUs")}
                value={contact.phone}
                href={`tel:${contact.phone}`}
              />
              <ContactRow
                icon={<Mail className="h-5 w-5 text-accent" />}
                label={t("contact.emailUs")}
                value={contact.email}
                href={`mailto:${contact.email}`}
              />
            </div>
          </div>

          {/* Form */}
          <Reveal
            delay={120}
            className="rounded-[var(--radius-base)] border border-cream/10 bg-charcoal/60 p-8"
          >
            <InquiryForm labels={labels} source="contact" />
          </Reveal>
        </div>

        {/* Office map */}
        {contact.lat != null && contact.lng != null && (
          <Reveal className="mt-20">
            <h2 className="eyebrow text-accent">{t("contact.findUs")}</h2>
            <div className="mt-6 h-[420px] w-full overflow-hidden rounded-[var(--radius-base)] border border-cream/10">
              <MapViewDynamic
                zoom={15}
                pins={[
                  {
                    id: "office",
                    title: settings.name,
                    lat: contact.lat,
                    lng: contact.lng,
                  },
                ]}
              />
            </div>
          </Reveal>
        )}
      </Container>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/15">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-widest text-cream/45">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="mt-1 block text-lg text-cream transition hover:text-accent"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 text-lg text-cream">{value}</p>
        )}
      </div>
    </div>
  );
}

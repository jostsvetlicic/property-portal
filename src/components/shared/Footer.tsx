import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "./Container";

/** Inline Instagram glyph (lucide removed brand icons for trademark reasons). */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
import { getSettings } from "@/lib/settings";
import { getTranslations } from "@/lib/i18n";
import { NewsletterSignup } from "./NewsletterSignup";

/**
 * Site footer. Reads all agency details from the runtime settings so it
 * re-skins with the central config / admin.
 */
export async function Footer() {
  const [settings, { t, locale }] = await Promise.all([
    getSettings(),
    getTranslations(),
  ]);
  const { contact } = settings;
  const listingsLabel =
    settings.mode === "boutique" ? t("nav.collection") : t("nav.listings");

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cream/10 bg-charcoal">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="font-display text-xl tracking-[0.2em] text-cream">
              {settings.logoText}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="eyebrow text-accent">{t("footer.explore")}</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/70">
              <li>
                <Link href="/listings" className="hover:text-accent">
                  {listingsLabel}
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-accent">
                  {t("nav.agents")}
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-accent">
                  {t("nav.insights")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="eyebrow text-accent">{t("nav.contact")}</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href={`tel:${contact.phone}`} className="hover:text-accent">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${contact.email}`} className="hover:text-accent">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Connect + newsletter */}
          <div>
            <h4 className="eyebrow text-accent">{t("newsletter.heading")}</h4>
            <NewsletterSignup
              locale={locale}
              labels={{
                heading: t("newsletter.heading"),
                description: t("newsletter.description"),
                placeholder: t("newsletter.placeholder"),
                submit: t("newsletter.submit"),
                success: t("newsletter.success"),
                error: t("newsletter.error"),
              }}
            />
            <div className="mt-6 flex gap-3">
              {contact.instagram && (
                <a
                  href={`https://instagram.com/${contact.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-accent hover:text-accent"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 sm:flex-row">
          <p>
            © {year} {settings.name}. {t("footer.rights")}
          </p>
          <p className="tracking-widest">{settings.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}

import { getSettings } from "@/lib/settings";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

/** Admin settings — live branding + mode editor (writes DB Settings row). */
export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Branding, colors and front-end mode. Changes apply instantly."
      />
      <SettingsForm
        initial={{
          mode: settings.mode,
          name: settings.name,
          logoText: settings.logoText,
          tagline: settings.tagline ?? "",
          accentColor: settings.accentColor,
          baseColor: settings.baseColor,
          creamColor: settings.creamColor,
          email: settings.contact.email ?? "",
          phone: settings.contact.phone ?? "",
          address: settings.contact.address ?? "",
        }}
      />
    </div>
  );
}

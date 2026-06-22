import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { ProfileSection } from "@/components/shared/settings/ProfileSection";
import { SecuritySection } from "@/components/shared/settings/SecuritySection";
import { PrivacySection } from "@/components/shared/settings/PrivacySection";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading font-extrabold tracking-tight text-slate-900 text-2xl">
            Configurações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie sua conta e preferências</p>
        </div>

        <ProfileSection user={user} />
        <SecuritySection />
        <PrivacySection user={user} />
      </div>
    </div>
  );
}

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { ProfileSection } from "./ProfileSection";
import { SecuritySection } from "./SecuritySection";
import { PrivacySection } from "./PrivacySection";

interface SettingsPageProps {
  showSidebarTrigger?: boolean;
}

export function SettingsPage({ showSidebarTrigger }: SettingsPageProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-background">
      {showSidebarTrigger && (
        <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
          <SidebarTrigger className="-ml-1" />
          <div>
            <h1 className="font-heading font-extrabold tracking-tight text-foreground text-lg">
              Configurações
            </h1>
            <p className="text-xs text-muted-foreground">Gerencie sua conta e preferências</p>
          </div>
        </header>
      )}

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {!showSidebarTrigger && (
          <div>
            <h1 className="font-heading font-extrabold tracking-tight text-slate-900 text-2xl">
              Configurações
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie sua conta e preferências</p>
          </div>
        )}

        <ProfileSection user={user} />
        <SecuritySection />
        <PrivacySection user={user} />
      </div>
    </div>
  );
}

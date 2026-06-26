import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/shared/settings/SettingsPage";

export const Route = createFileRoute("/admin/settings")({
  component: () => <SettingsPage showSidebarTrigger />,
});

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { refresh } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createRootRoute({
  
  beforeLoad: async () => {
    const { user, accessToken, setAccessToken, logout } = useAuthStore.getState();
    if (user && !accessToken) {
      try {
        const data = await refresh();
        setAccessToken(data.access_token);
      } catch {
        logout();
      }
    }
  },
  component: RootLayout,
});

function RootLayout() {
  return (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  );
}

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { refresh } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createRootRoute({
  /**
   * Chamaa o Refresh Token endpoint para garantir a sessão caso tenha um User logado
   */
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
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </TooltipProvider>
  );
}

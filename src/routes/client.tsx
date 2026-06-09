import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { Calendar, CalendarDays, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { refresh } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/client")({
  beforeLoad: async () => {
    const { user, accessToken, setAccessToken, logout } = useAuthStore.getState();

    if (!user) throw redirect({ to: "/login" });

    if (!accessToken) {
      try {
        const data = await refresh();
        setAccessToken(data.access_token);
      } catch {
        logout();
        throw redirect({ to: "/login" });
      }
    }

    if (user.role !== "client") throw redirect({ to: "/" });
  },
  component: ClientLayout,
});

const NAV_ITEMS = [
  { to: "/client/appointments", label: "Agendamentos", Icon: CalendarDays },
  { to: "/client/account", label: "Conta", Icon: User },
] as const;

function ClientLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 inset-x-0 z-40 bg-[rgba(255,251,250,0.88)] backdrop-blur-lg border-b border-primary/12">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-linear-to-br from-chart-3 to-chart-2 size-7 rounded-lg flex items-center justify-center shadow-sm">
              <Calendar className="size-3.5 text-white" />
            </div>
            <span className="font-heading font-black text-lg text-slate-900 tracking-tight">
              Agendei
            </span>
          </Link>

          <Link
            to="/stores"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Store className="size-4" />
            Ver lojas
          </Link>
        </div>
      </header>

      <div className="flex-1 pt-14 pb-16">
        <Outlet />
      </div>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border">
        <div className="flex">
          {NAV_ITEMS.map(({ to, label, Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

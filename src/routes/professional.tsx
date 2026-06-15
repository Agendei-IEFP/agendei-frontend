import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Clock, Home, LogOut, Settings, Store, Tag } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useServices";
import { useStore } from "@/hooks/useStores";
import { refresh } from "@/lib/api/auth";
import { getInitials } from "@/lib/format";

export const Route = createFileRoute("/professional")({
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

    if (user.role !== "professional") throw redirect({ to: "/" });
  },
  component: ProfissionalLayout,
});

function SidebarLink({ to, children }: { to: string; children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === to || pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-salmon-100 text-chart-3"
          : "text-foreground hover:bg-muted hover:text-chart-3"
      }`}
    >
      {children}
    </Link>
  );
}

function ProfissionalLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { data: profile } = useMyProfile();
  const { data: myStore } = useStore(profile?.store_id ?? "");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-border z-30">
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2.5 border-b border-border">
          <div className="size-7 rounded-xl flex items-center justify-center bg-linear-to-br from-chart-3 to-chart-2">
            <CalendarDays className="size-3.5 text-white" />
          </div>
          <span className="font-heading font-bold text-foreground tracking-tight">Agendei</span>
        </div>

        {/* Avatar + nome */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 bg-linear-to-br from-chart-3 to-chart-2">
              {getInitials(user?.name || "--")}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">Profissional</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className="text-xs font-bold uppercase tracking-widest px-2.5 pt-2 pb-1.5 text-muted-warm">
            Geral
          </p>

          <SidebarLink to="/professional/dashboard">
            <Home className="size-4 shrink-0" />
            Painel
          </SidebarLink>

          <SidebarLink to="/professional/agenda">
            <CalendarDays className="size-4 shrink-0" />
            Agenda
          </SidebarLink>

          <p className="text-xs font-bold uppercase tracking-widest px-2.5 pt-4 pb-1.5 text-muted-warm">
            Gestão
          </p>

          <SidebarLink to="/professional/services">
            <Tag className="size-4 shrink-0" />
            Meus Serviços
          </SidebarLink>

          <SidebarLink to="/professional/schedules">
            <Clock className="size-4 shrink-0" />
            Meus Horários
          </SidebarLink>

          {myStore && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest px-2.5 pt-4 pb-1.5 text-muted-warm">
                Minha Loja
              </p>
              <Link
                to="/professional/store/$storeId"
                params={{ storeId: myStore.id }}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith(`/professional/store/${myStore.id}`)
                    ? "bg-salmon-100 text-chart-3"
                    : "text-foreground hover:bg-muted hover:text-chart-3"
                }`}
              >
                <Store className="size-4 shrink-0" />
                <span className="truncate">{myStore.name}</span>
              </Link>
            </>
          )}

          <p className="text-xs font-bold uppercase tracking-widest px-2.5 pt-4 pb-1.5 text-muted-warm">
            Conta
          </p>

          <SidebarLink to="/professional/settings">
            <Settings className="size-4 shrink-0" />
            Configurações
          </SidebarLink>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => logout.mutate()}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-destructive hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="size-4 shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Conteúdo principal ── */}
      <div className="flex-1 flex flex-col md:ml-56 pb-16 md:pb-0">
        <Outlet />
      </div>

      {/* ── Bottom nav (mobile) ── */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden bg-white border-t border-border z-30 flex">
        {[
          { to: "/professional/dashboard", icon: Home, label: "Painel" },
          { to: "/professional/agenda", icon: CalendarDays, label: "Agenda" },
          { to: "/professional/services", icon: Tag, label: "Serviços" },
        ].map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? "text-chart-3" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}

        {/* Loja vinculada */}
        {myStore ? (
          <Link
            to="/professional/store/$storeId"
            params={{ storeId: myStore.id }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
              pathname.startsWith("/professional/store") ? "text-chart-3" : "text-muted-foreground"
            }`}
          >
            <Store className="size-5" />
            Loja
          </Link>
        ) : (
          <span className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium text-muted-foreground opacity-40 cursor-not-allowed">
            <Store className="size-5" />
            Loja
          </span>
        )}
      </nav>
    </div>
  );
}

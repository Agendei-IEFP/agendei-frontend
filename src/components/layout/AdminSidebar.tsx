import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Store, Users, ClipboardList, Calendar, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { useMyStores } from "@/hooks/useStores";
import { useLogout } from "@/hooks/useAuth";
import { Logo } from "@/components/shared/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const user = useAuthStore((s) => s.user);
  const { mutate: logoutUser } = useLogout();
  const { data: lojas } = useMyStores();
  const lojaCount = lojas?.length ?? 0;
  const serviceCount = lojas?.reduce((acc, s) => acc + s.service_count, 0) ?? 0;

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-4 border-sidebar-border">
        <Logo size="sm" variant="on-white" />
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 **:data-[sidebar='menu-button']:h-10 md:**:data-[sidebar='menu-button']:h-8">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[0.7rem] font-bold uppercase tracking-widest px-2.5 pt-2 pb-1.5 text-muted-warm h-auto">
            Geral
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/dashboard")}>
                  <Link to="/admin/dashboard">
                    <Home />
                    <span>Painel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/store")}>
                  <Link to="/admin/store">
                    <Store />
                    <span>Minhas Lojas</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge
                  className={cn(
                    "text-[0.62rem]",
                    isActive("/admin/store")
                      ? "bg-muted text-chart-3"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  {lojaCount}
                </SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0 mt-2">
          <SidebarGroupLabel className="text-[0.7rem] font-bold uppercase tracking-widest px-2.5 pt-2 pb-1.5 text-muted-warm h-auto">
            Gestão
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/professionals")}>
                  <Link to="/admin/professionals">
                    <Users />
                    <span>Profissionais</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/servicos")}>
                  <Link to="/admin/servicos">
                    <ClipboardList />
                    <span>Serviços</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge
                  className={cn(
                    "text-[0.62rem]",
                    isActive("/admin/servicos")
                      ? "bg-muted text-chart-3"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  {serviceCount}
                </SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <Calendar />
                  <span>Agendamentos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0 mt-2">
          <SidebarGroupLabel className="text-[0.7rem] font-bold uppercase tracking-widest px-2.5 pt-2 pb-1.5 text-muted-warm h-auto">
            Conta
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <Settings />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => logoutUser()}
          className="w-full flex items-center gap-2.5 px-1.5 py-1 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-left"
        >
          <div className="size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-muted text-chart-4">
            {user ? getInitials(user.name) : "—"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.name ?? ""}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role ?? ""}</p>
          </div>
          <LogOut className="size-3.5 shrink-0 text-slate-400" />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

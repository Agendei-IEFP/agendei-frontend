import { Link } from "@tanstack/react-router";
import { LogOut, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import type { RoleEnum } from "@/types/enums";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PANEL_LINK: Record<RoleEnum, { to: string; label: string }> = {
  client: { to: "/client/appointments", label: "Os meus agendamentos" },
  professional: { to: "/professional/dashboard", label: "Painel profissional" },
  store_admin: { to: "/admin/dashboard", label: "Painel de admin" },
};

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  if (!user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Link
          to="/login"
          className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          Entrar
        </Link>
        <Link
          to="/register"
          className="btn-salmon px-4 py-2 text-sm text-white font-bold rounded-[10px]"
        >
          Cadastrar minha loja →
        </Link>
      </div>
    );
  }

  const panel = PANEL_LINK[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "size-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0",
          "bg-linear-to-br from-chart-3 to-primary",
          "shadow-[0_2px_8px_rgba(224,80,64,0.30)] hover:opacity-90 transition-opacity",
          className,
        )}
      >
        {getInitials(user.name)}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to={panel.to} className="flex items-center gap-2.5 cursor-pointer">
            <CalendarDays className="size-4 text-muted-foreground shrink-0" />
            {panel.label}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => logout.mutate()}
          className="flex items-center gap-2.5 text-destructive focus:text-destructive focus:bg-red-50 cursor-pointer"
        >
          <LogOut className="size-4 shrink-0" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

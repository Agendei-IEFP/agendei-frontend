import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import type { RoleEnum } from "@/types/enums";

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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

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
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "size-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0",
          "bg-linear-to-br from-chart-3 to-primary",
          "shadow-[0_2px_8px_rgba(224,80,64,0.30)] hover:opacity-90 transition-opacity",
        )}
      >
        {getInitials(user.name)}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>

          <div className="flex flex-col py-1">
            <Link
              to={panel.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <CalendarDays className="size-4 text-muted-foreground shrink-0" />
              {panel.label}
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                logout.mutate();
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut className="size-4 shrink-0" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Calendar, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { UserMenu } from "@/components/shared/UserMenu";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[rgba(255,251,250,0.88)] backdrop-blur-lg border-b border-primary/12">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-linear-to-br from-chart-3 to-chart-2 size-8 rounded-xl flex items-center justify-center shadow-sm">
            <Calendar className="size-4 text-white" />
          </div>
          <span className="font-heading font-black text-xl text-slate-900 tracking-tight">
            Agendei
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-500">
          <a href="#como-funciona" className="nav-link-landing">
            Como funciona
          </a>
          <a href="#funcionalidades" className="nav-link-landing">
            Funcionalidades
          </a>
          <a href="#para-quem" className="nav-link-landing">
            Para quem
          </a>
          <Link to="/stores" className="nav-link-landing">
            Ver lojas
          </Link>
        </nav>

        <UserMenu className="hidden md:flex" />

        {user ? (
          <UserMenu className="md:hidden" />
        ) : (
          <button
            type="button"
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        )}
      </div>

      {!user && open && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-md px-6 py-4 flex flex-col gap-1">
          <a
            href="#funcionalidades"
            className="text-sm text-slate-600 py-2.5"
            onClick={() => setOpen(false)}
          >
            Funcionalidades
          </a>
          <a
            href="#como-funciona"
            className="text-sm text-slate-600 py-2.5"
            onClick={() => setOpen(false)}
          >
            Como funciona
          </a>
          <a
            href="#para-quem"
            className="text-sm text-slate-600 py-2.5"
            onClick={() => setOpen(false)}
          >
            Para quem
          </a>
          <Link
            to="/stores"
            className="text-sm text-slate-600 py-2.5"
            onClick={() => setOpen(false)}
          >
            Ver lojas
          </Link>
          <div className="pt-3 border-t border-border mt-1">
            <UserMenu />
          </div>
        </div>
      )}
    </header>
  );
}

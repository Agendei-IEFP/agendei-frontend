import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Calendar, Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

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
          <a href="#como-funciona" className="nav-link-landing">Como funciona</a>
          <a href="#funcionalidades" className="nav-link-landing">Funcionalidades</a>
          <a href="#para-quem" className="nav-link-landing">Para quem</a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="btn-salmon px-4 py-2 text-sm text-white font-bold rounded-[10px]"
          >
            Cadastrar minha loja →
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-md px-6 py-4 flex flex-col gap-1">
          <a href="#funcionalidades" className="text-sm text-slate-600 py-2.5" onClick={() => setOpen(false)}>
            Funcionalidades
          </a>
          <a href="#como-funciona" className="text-sm text-slate-600 py-2.5" onClick={() => setOpen(false)}>
            Como funciona
          </a>
          <a href="#para-quem" className="text-sm text-slate-600 py-2.5" onClick={() => setOpen(false)}>
            Para quem
          </a>
          <div className="pt-3 flex flex-col gap-2 border-t border-border mt-1">
            <Link
              to="/login"
              className="text-sm text-slate-600 py-2.5 font-medium"
              onClick={() => setOpen(false)}
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="btn-salmon px-4 py-3 text-sm text-white font-bold rounded-[10px] text-center"
              onClick={() => setOpen(false)}
            >
              Cadastrar minha loja →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

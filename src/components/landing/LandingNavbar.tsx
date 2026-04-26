import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";

export function LandingNavbar() {
  return (
    <header className="navbar-landing">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="logo-icon-gradient w-8 h-8 rounded-xl flex items-center justify-center shadow-sm">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-xl text-slate-900 tracking-tight">
            Agendei
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-500">
          <a href="#funcionalidades" className="nav-link-landing">
            Funcionalidades
          </a>
          <a href="#como-funciona" className="nav-link-landing">
            Como funciona
          </a>
          <a href="#para-quem" className="nav-link-landing">
            Para quem
          </a>
        </nav>

        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}

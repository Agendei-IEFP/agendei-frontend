import { Link } from "@tanstack/react-router";
import { Zap, Calendar } from "lucide-react";

export function CtaSection() {
  return (
    <>
      <section className="py-24 px-6 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <div className="cta-box">
            <div className="absolute top-0 right-0 size-72 rounded-full bg-white/[0.06] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 size-44 rounded-full bg-white/[0.05] -translate-x-1/2 translate-y-1/2" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/[0.18] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                <Zap className="size-3.5" />
                Configure em 5 minutos
              </div>

              <h2 className="font-display font-black text-white mb-4 text-[clamp(2rem,4vw,2.6rem)] tracking-tight">
                Seus clientes já podem
                <br />
                agendar hoje
              </h2>

              <p className="mb-8 text-lg text-white/80">
                Cadastre a loja, adicione os profissionais e compartilhe o link. É isso.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/cadastro" className="cta-btn-white">
                  Cadastrar minha loja →
                </Link>
                <a href="#como-funciona" className="cta-btn-outline">
                  Ver demonstração
                </a>
              </div>

              <p className="text-xs mt-4 text-white/55">
                Sem cartão de crédito · Sem pagamentos · 100% gratuito
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8 flex-wrap gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="logo-icon-gradient size-7 rounded-lg flex items-center justify-center">
                  <Calendar className="size-3.5 text-white" />
                </div>
                <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
                  Agendei
                </span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs">
                Plataforma de agendamento para salões de beleza. Simples, rápido, sem ligações.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-12 text-sm">
              <div>
                <p className="font-semibold text-slate-900 mb-3">Produto</p>
                <div className="space-y-2 text-slate-500">
                  <p>
                    <a href="#funcionalidades" className="hover:text-slate-800 transition-colors">
                      Funcionalidades
                    </a>
                  </p>
                  <p>
                    <a href="#como-funciona" className="hover:text-slate-800 transition-colors">
                      Como funciona
                    </a>
                  </p>
                  <p>
                    <a href="#para-quem" className="hover:text-slate-800 transition-colors">
                      Para quem
                    </a>
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-3">Conta</p>
                <div className="space-y-2 text-slate-500">
                  <p>
                    <Link to="/login" className="hover:text-slate-800 transition-colors">
                      Entrar
                    </Link>
                  </p>
                  <p>
                    <Link to="/cadastro" className="hover:text-slate-800 transition-colors">
                      Cadastrar loja
                    </Link>
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-3">Legal</p>
                <div className="space-y-2 text-slate-500">
                  <p>
                    <a href="#" className="hover:text-slate-800 transition-colors">
                      Termos de uso
                    </a>
                  </p>
                  <p>
                    <a href="#" className="hover:text-slate-800 transition-colors">
                      Privacidade (RGPD)
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between flex-wrap gap-4 border-t border-border">
            <p className="text-xs text-slate-400">© 2026 Agendei. Todos os direitos reservados.</p>
            <p className="text-xs text-slate-400">Feito com React + FastAPI</p>
          </div>
        </div>
      </footer>
    </>
  );
}

import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, Users, ClipboardList } from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Agendamentos", icon: Calendar },
  { label: "Profissionais", icon: Users },
  { label: "Serviços", icon: ClipboardList },
];

const APPOINTMENTS = [
  {
    time: "09:00",
    dur: "60min",
    letter: "J",
    letterCls: "bg-muted text-chart-4",
    client: "Maria Silva",
    service: "Corte feminino · João Silva",
    badge: "confirmado",
    badgeCls: "bg-emerald-100 text-emerald-700",
  },
  {
    time: "11:00",
    dur: "30min",
    letter: "A",
    letterCls: "bg-blue-100 text-blue-700",
    client: "Joana Matos",
    service: "Manicure · Ana Costa",
    badge: "pendente",
    badgeCls: "bg-amber-100 text-amber-700",
  },
  {
    time: "14:30",
    dur: "90min",
    letter: "C",
    letterCls: "bg-teal-100 text-teal-700",
    client: "Fernanda Lima",
    service: "Coloração · Carla Matos",
    badge: "confirmado",
    badgeCls: "bg-emerald-100 text-emerald-700",
  },
];

export function HeroSection() {
  return (
    <section className="hero-bg pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-badge hero-fade-badge">Para profissionais e donos de salão</div>
          <h1 className="font-heading font-black text-slate-900 leading-tight mb-6 text-[clamp(2.6rem,6vw,3.8rem)] tracking-tight hero-fade-title">
            Sua agenda no
            <br />
            <span className="gradient-text">piloto automático</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed hero-fade-body">
            Configure sua loja em minutos. Seus clientes agendam online, 24h por dia —
            <br className="hidden md:block" />
            você foca no que realmente importa: o atendimento.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center hero-fade-actions">
            <Link
              to="/cadastro"
              className="btn-salmon px-6 py-3 text-sm text-white font-bold rounded-[10px]"
            >
              Cadastrar minha loja →
            </Link>
            <a href="#como-funciona" className="btn-secondary-landing px-6 py-3 text-sm">
              Ver como funciona
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-4 hero-fade-hint">
            Sem cartão de crédito. Configuração em 5 minutos.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto hero-fade-mockup">
          <div className="absolute inset-0 rounded-3xl scale-95 blur-3xl bg-primary/14" />

          <div className="relative bg-white rounded-2xl border border-border shadow-2xl overflow-hidden hero-window">
            {/* Barra da janela */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-[#fdf9f8]">
              <div className="size-3 rounded-full bg-red-400" />
              <div className="size-3 rounded-full bg-amber-400" />
              <div className="size-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="bg-white border border-border rounded-md px-3 py-1 text-xs text-center text-[#b0958f]">
                  agendei.app/admin · Studio Beleza
                </div>
              </div>
            </div>

            <div className="flex h-[360px]">
              {/* Sidebar */}
              <div className="w-48 border-r border-border p-4 flex flex-col gap-1 shrink-0 bg-[#fdf9f8]">
                <div className="mb-4 flex items-center gap-2">
                  <div className="size-8 rounded-full flex items-center justify-center shrink-0 bg-muted">
                    <Calendar className="size-4 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Studio Beleza</p>
                    <p className="text-xs text-slate-400">Admin</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold bg-muted text-chart-3">
                  <LayoutDashboard className="size-3.5 shrink-0" />
                  Painel
                </div>

                {SIDEBAR_ITEMS.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 p-2 rounded-lg text-xs text-slate-500"
                  >
                    <Icon className="size-3.5 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              {/* Painel principal */}
              <div className="flex-1 p-5 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Painel · 24 abr 2026</h4>
                    <p className="text-xs text-slate-400">Quinta-feira</p>
                  </div>
                  <span className="chip bg-muted text-chart-4">3 profissionais ativos</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl p-3 bg-muted border border-input">
                    <p className="text-xl font-black text-chart-4">8</p>
                    <p className="text-xs text-slate-500 mt-0.5">agendamentos hoje</p>
                  </div>
                  <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-100">
                    <p className="text-xl font-black text-emerald-700">6</p>
                    <p className="text-xs text-slate-500 mt-0.5">confirmados</p>
                  </div>
                  <div className="rounded-xl p-3 bg-amber-50 border border-amber-100">
                    <p className="text-xl font-black text-amber-600">2</p>
                    <p className="text-xs text-slate-500 mt-0.5">pendentes</p>
                  </div>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-warm">
                  Próximos atendimentos
                </p>
                <div className="space-y-2">
                  {APPOINTMENTS.map((a) => (
                    <div
                      key={a.time}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center w-9">
                          <p className="text-xs font-bold text-slate-900">{a.time}</p>
                          <p className="text-xs text-slate-400">{a.dur}</p>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div
                          className={`size-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${a.letterCls}`}
                        >
                          {a.letter}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{a.client}</p>
                          <p className="text-xs text-slate-400">{a.service}</p>
                        </div>
                      </div>
                      <span className={`chip ${a.badgeCls}`}>{a.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card flutuante — novo agendamento */}
          <div className="absolute -right-4 top-10 bg-white rounded-xl border border-border px-4 py-3 w-56 hidden md:block animate-float hero-float-card">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Calendar className="size-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Novo agendamento!</p>
                <p className="text-xs text-slate-400">Patrícia R. · 25 abr · 10:00</p>
              </div>
            </div>
          </div>

          {/* Card flutuante — stats */}
          <div className="absolute -left-4 bottom-16 bg-white rounded-xl border border-border px-4 py-3 w-44 hidden md:block animate-float-delayed hero-float-card">
            <p className="text-xs font-bold text-slate-500 mb-1">Esta semana</p>
            <p className="text-2xl font-black text-chart-3">28</p>
            <p className="text-xs text-slate-400">atendimentos</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Check } from "lucide-react";
import { useRevealAnimation } from "@/components/landing/useRevealAnimation";

function Benefit({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="size-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Check className="size-3 text-chart-3" />
      </div>
      <span className="text-sm text-slate-600">{text}</span>
    </li>
  );
}

function WindowBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-background">
      <div className="size-2.5 rounded-full bg-red-400" />
      <div className="size-2.5 rounded-full bg-amber-400" />
      <div className="size-2.5 rounded-full bg-green-400" />
      <span className="text-xs text-slate-400 ml-2">{title}</span>
    </div>
  );
}

function ProfissionalMockup() {
  const appointments = [
    {
      time: "09:00",
      dur: "60min",
      client: "Maria Silva",
      service: "Corte feminino",
      badge: "confirmado",
      badgeCls: "bg-emerald-100 text-emerald-700",
      cancelled: false,
    },
    {
      time: "11:00",
      dur: "120min",
      client: "Ana Costa",
      service: "Coloração completa",
      badge: "pendente",
      badgeCls: "bg-amber-100 text-amber-700",
      cancelled: false,
    },
    {
      time: "14:30",
      dur: "60min",
      client: "Pedro Santos",
      service: "Corte masculino",
      badge: "cancelado",
      badgeCls: "bg-red-100 text-red-500",
      cancelled: true,
    },
  ];

  return (
    <div className="mockup-window">
      <WindowBar title="Painel — João Silva" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900">Hoje · 24 abr 2026</h4>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-400 hover:text-slate-600">‹</button>
            <button className="p-1 text-slate-400 hover:text-slate-600">›</button>
          </div>
        </div>
        <div className="space-y-2">
          {appointments.map((a) => (
            <div
              key={a.time}
              className={`border rounded-xl p-3 ${a.cancelled ? "opacity-50 border-red-100" : "border-border"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-center w-10">
                    <p
                      className={`text-xs font-bold ${a.cancelled ? "text-slate-400" : "text-slate-900"}`}
                    >
                      {a.time}
                    </p>
                    <p className={`text-xs ${a.cancelled ? "text-slate-300" : "text-slate-400"}`}>
                      {a.dur}
                    </p>
                  </div>
                  <div className="w-px h-7 bg-slate-200" />
                  <div>
                    <p
                      className={`text-xs font-semibold ${a.cancelled ? "text-slate-400 line-through" : "text-slate-900"}`}
                    >
                      {a.client}
                    </p>
                    <p className="text-xs text-slate-500">{a.service}</p>
                  </div>
                </div>
                <span className={`chip ${a.badgeCls}`}>{a.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminMockup() {
  const profs = [
    { letter: "J", name: "João Silva", today: "4 atend.", cls: "bg-muted text-chart-4" },
    { letter: "A", name: "Ana Costa", today: "3 atend.", cls: "bg-blue-100 text-blue-700" },
    { letter: "C", name: "Carla Matos", today: "2 atend.", cls: "bg-teal-100 text-teal-700" },
  ];

  return (
    <div className="mockup-window">
      <WindowBar title="Admin · Studio Beleza" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900">Profissionais</h4>
          <button className="btn-salmon px-3 py-1.5 text-xs text-white font-bold rounded-lg">
            + Adicionar
          </button>
        </div>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {profs.map((p) => (
            <div key={p.name} className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div
                  className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${p.cls}`}
                >
                  {p.letter}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.today}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="chip bg-emerald-100 text-emerald-700">✓ Ativo</span>
                <button className="text-slate-300 hover:text-red-500 text-xs transition-colors">
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ForWhom() {
  const ref = useRevealAnimation();

  return (
    <section id="para-quem" className="py-14 px-4 md:py-24 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="text-center mb-10 md:mb-16 reveal">
          <div className="section-badge">Para quem</div>
          <h2 className="font-heading font-black text-slate-900 mb-4 text-[clamp(2rem,4vw,2.6rem)] tracking-tight">
            Uma plataforma, dois papéis
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Cada papel tem a sua área dedicada — com as ferramentas certas e sem informação a mais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="reveal reveal-d1">
            <div className="section-badge">Para Profissionais</div>
            <h3 className="font-heading font-black text-slate-900 mb-4 text-[1.75rem] tracking-tight">
              Sua agenda sempre organizada
            </h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Veja todos os atendimentos do dia num painel limpo. Confirme, cancele ou reagende sem
              depender do admin.
            </p>
            <ul className="space-y-3 mb-8">
              <Benefit text="Painel do dia com todos os atendimentos e status" />
              <Benefit text="Gerencie seus serviços e preços sem depender do admin" />
              <Benefit text="Defina seus horários de trabalho por dia da semana" />
            </ul>
            <ProfissionalMockup />
          </div>

          <div className="reveal reveal-d2">
            <div className="section-badge">Para Donos de Loja</div>
            <h3 className="font-heading font-black text-slate-900 mb-4 text-[1.75rem] tracking-tight">
              Controle total, sem virar atendente
            </h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Gerencie equipa, acompanhe todos os agendamentos e mantenha a vitrine da loja sempre
              atualizada — tudo num painel.
            </p>
            <ul className="space-y-3 mb-8">
              <Benefit text="Adicione ou remova profissionais da equipa a qualquer hora" />
              <Benefit text="Veja todos os agendamentos da loja com filtros" />
              <Benefit text="Edite a vitrine pública e os dados da loja" />
            </ul>
            <AdminMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

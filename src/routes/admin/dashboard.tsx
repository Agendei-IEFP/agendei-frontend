import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Plus, Store, Users, ClipboardList, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useMinhasLojas } from "@/hooks/useLojas";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function getGreetingName(nome: string): string {
  return nome.split(" ")[0];
}

function formatDate(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

// Capitalizes the first letter — Intl returns lowercase weekday in pt-BR
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: lojas = [] } = useMinhasLojas();

  const hasLojas = lojas.length > 0;

  return (
    <div className="flex flex-col flex-1">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 px-4 md:px-8 py-3.5 flex items-center justify-between bg-background/93 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden text-slate-500" />
          <div>
            <h1 className="font-heading font-bold text-slate-900 text-lg tracking-[-0.02em]">
              Painel
            </h1>
            <p className="text-xs text-muted-foreground">{capitalize(formatDate())}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-slate-500 hover:bg-muted hover:text-slate-800 transition-colors">
            <Bell className="size-4.5" />
          </button>
          <Link
            to="/admin/loja/editar"
            className="btn-salmon flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-[9px]"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Criar loja</span>
          </Link>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 p-4 md:p-8">
        {/* Welcome banner — shown only when there are no stores yet */}
        {!hasLojas && (
          <div className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-hidden relative border border-salmon-200 bg-linear-to-br from-muted via-salmon-100 to-salmon-200">
            <div className="relative">
              <p className="text-[0.7rem] font-bold uppercase tracking-widest mb-1 text-chart-4">
                Bem-vindo ao Agendei
              </p>
              <h2 className="font-heading font-bold text-slate-900 text-xl tracking-[-0.025em] mb-1">
                Olá, {user ? getGreetingName(user.nome) : ""}!
              </h2>
              <p className="text-sm text-muted-foreground">
                Sua conta está pronta. Crie sua primeira loja para começar a receber agendamentos.
              </p>
            </div>

            <Link
              to="/admin/loja/editar"
              className="btn-salmon flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-[9px] relative sm:shrink-0"
            >
              <Plus className="size-4" />
              Criar minha loja
            </Link>
          </div>
        )}

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Lojas"
            icon={<Store className="size-4 text-chart-3" />}
            iconBg="bg-muted"
            value={String(lojas.length)}
            sub="cadastradas"
          />
          <StatCard
            label="Profissionais"
            icon={<Users className="size-4 text-slate-400" />}
            iconBg="bg-slate-50"
            value="—"
            sub="vinculados"
            dimmed
          />
          <StatCard
            label="Serviços"
            icon={<ClipboardList className="size-4 text-slate-400" />}
            iconBg="bg-slate-50"
            value="—"
            sub="cadastrados"
            dimmed
          />
          <StatCard
            label="Agendamentos"
            icon={<Calendar className="size-4 text-slate-400" />}
            iconBg="bg-slate-50"
            value="—"
            sub="este mês"
            dimmed
          />
        </div>

        {/* ── Minhas Lojas section ── */}
        <div className="rounded-2xl border border-border bg-card mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="font-heading font-bold text-slate-900 text-[1.1rem] tracking-[-0.02em]">
                Minhas Lojas
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Gerencie seus estabelecimentos</p>
            </div>
          </div>

          {hasLojas ? (
            <ul className="divide-y divide-border">
              {lojas.map((loja) => (
                <li key={loja.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Store className="size-5 text-chart-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{loja.nome}</p>
                    {loja.endereco && (
                      <p className="text-xs text-muted-foreground truncate">{loja.endereco}</p>
                    )}
                  </div>
                  <span
                    className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${loja.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {loja.is_active ? "Ativa" : "Inativa"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="relative mb-6">
                <div className="pulse-ring" />
                <div className="pulse-ring pulse-ring-2" />
                <div className="size-16 rounded-2xl flex items-center justify-center relative bg-linear-to-br from-salmon-100 to-salmon-200">
                  <Store className="text-chart-3" style={{ width: 30, height: 30 }} />
                </div>
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-lg tracking-[-0.02em] mb-2">
                Crie seu primeiro estabelecimento
              </h3>
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
                Cadastre sua loja, adicione profissionais e serviços, e comece a receber
                agendamentos online em minutos.
              </p>
              <Link
                to="/admin/loja/editar"
                className="btn-salmon flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-[9px]"
              >
                <Plus className="size-4" />
                Criar estabelecimento
              </Link>
              <p className="text-xs text-muted-foreground mt-3">Leva menos de 2 minutos</p>
            </div>
          )}
        </div>

        {/* ── O que você vai poder fazer ── */}
        {!hasLojas && (
          <>
            <div className="mb-5">
              <h2 className="font-heading font-bold text-slate-900 text-[1.05rem] tracking-[-0.02em] mb-1">
                O que você vai poder fazer
              </h2>
              <p className="text-xs text-muted-foreground">
                Após criar sua loja, tudo isso estará disponível
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <FeatureCard
                iconBg="bg-muted"
                icon={<Users className="text-chart-3" style={{ width: 20, height: 20 }} />}
                tag="Passo 2"
                tagStyle="bg-slate-100 text-slate-500"
                title="Cadastrar profissionais"
                description="Adicione os profissionais da sua equipe com bio, foto e disponibilidade individual de horários."
              />
              <FeatureCard
                iconBg="bg-blue-50"
                icon={<ClipboardList className="text-blue-600" style={{ width: 20, height: 20 }} />}
                tag="Passo 3"
                tagStyle="bg-slate-100 text-slate-500"
                title="Configurar serviços"
                description="Defina serviços com nome, preço e duração. Cada profissional pode ter o seu próprio catálogo."
              />
              <FeatureCard
                iconBg="bg-emerald-50"
                icon={<Calendar className="text-green-600" style={{ width: 20, height: 20 }} />}
                tag="Resultado"
                tagStyle="bg-emerald-100 text-emerald-700"
                title="Receber agendamentos"
                description="Sua loja aparece na listagem pública do Agendei e clientes podem reservar horários 24h por dia."
              />
            </div>
          </>
        )}

        {/* ── Atividade recente ── */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="font-heading font-bold text-slate-900 text-[1.1rem] tracking-[-0.02em]">
                Atividade recente
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Agendamentos e atualizações</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="size-12 rounded-2xl flex items-center justify-center mb-3 bg-muted">
              <Calendar className="text-border" style={{ width: 22, height: 22 }} />
            </div>
            <p className="text-sm font-semibold text-slate-700">Nenhuma atividade ainda</p>
            <p className="text-xs text-slate-400 mt-1">
              Os agendamentos e eventos da sua loja vão aparecer aqui.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  sub: string;
  dimmed?: boolean;
}

function StatCard({ label, icon, iconBg, value, sub, dimmed }: StatCardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 ${dimmed ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className={`size-8 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
      </div>
      <p
        className={`font-heading font-bold text-3xl tracking-[-0.03em] ${dimmed ? "text-slate-300" : "text-slate-900"}`}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

interface FeatureCardProps {
  iconBg: string;
  icon: React.ReactNode;
  tag: string;
  tagStyle: string;
  title: string;
  description: string;
}

function FeatureCard({ iconBg, icon, tag, tagStyle, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-salmon-200 hover:shadow-salmon-card hover:-translate-y-px">
      <div className={`size-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        {icon}
      </div>
      <span
        className={`inline-flex items-center text-[0.65rem] font-semibold px-2 py-0.5 rounded-full mb-3 ${tagStyle}`}
      >
        {tag}
      </span>
      <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Calendar, ClipboardList, MapPin, Pencil, Plus, Store, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useMyStores } from "@/hooks/useStores";
import { useMyProfessionals } from "@/hooks/useProfessionals";
import { useAllStoreAppointments } from "@/hooks/useAppointments";
import { useQueries } from "@tanstack/react-query";
import { getStoreServices } from "@/lib/api/stores";
import type { StoreServiceDTO } from "@/types/api";
import { StatusBadge } from "@/components/agendamentos/StatusBadge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StoreFormDialog } from "@/components/store/StoreFormDialog";
import { capitalize, formatCurrentDate, getGreetingName, getInitials } from "@/lib/format";
import type { AppointmentAdminDTO, ProfessionalWithStoreDTO, StoreDTO } from "@/types/api";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: lojas = [] } = useMyStores();
  const { data: professionals = [] } = useMyProfessionals();
  const storeIds = lojas.map((s) => s.id);
  const {
    data: appointments,
    total: apptTotal,
    isLoading: aptsLoading,
  } = useAllStoreAppointments(storeIds);
  const serviceResults = useQueries({
    queries: storeIds.map((id) => ({
      queryKey: ["stores", id, "services"],
      queryFn: () => getStoreServices(id),
    })),
  });
  const serviceRows: StoreServiceDTO[] = serviceResults.flatMap((r) => r.data ?? []);

  const profCount = lojas.reduce((acc, s) => acc + s.professional_count, 0);
  const serviceCount = lojas.reduce((acc, s) => acc + s.service_count, 0);
  const hasLojas = lojas.length > 0;

  const [storeDialog, setStoreDialog] = useState<{
    open: boolean;
    mode: "create" | "edit";
    store?: StoreDTO;
  }>({ open: false, mode: "create" });

  const openCreate = () => setStoreDialog({ open: true, mode: "create" });
  const openEdit = (store: StoreDTO) => setStoreDialog({ open: true, mode: "edit", store });

  return (
    <div className="flex flex-col flex-1">
      {/*  Header  */}
      <header className="sticky top-0 z-20 px-2 md:px-8 py-3.5 flex items-center justify-between bg-background/93 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden text-slate-500" />
          <div>
            <h1 className="font-heading font-bold text-slate-900 text-lg tracking-[-0.02em]">
              Painel
            </h1>
            <p className="text-xs text-muted-foreground">{capitalize(formatCurrentDate())}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCreate}
            className="btn-salmon flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-[9px]"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Criar loja</span>
          </button>
        </div>
      </header>

      {/*  Content  */}
      <main className="flex-1 p-2 md:p-8">
        {/* Welcome banner — shown only when there are no stores yet */}
        {!hasLojas && (
          <div className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-hidden relative border border-salmon-200 bg-linear-to-br from-muted via-salmon-100 to-salmon-200">
            <div className="relative">
              <p className="text-[0.7rem] font-bold uppercase tracking-widest mb-1 text-chart-4">
                Bem-vindo ao Agendei
              </p>
              <h2 className="font-heading font-bold text-slate-900 text-xl tracking-tight mb-1">
                Olá, {user ? getGreetingName(user.name) : ""}!
              </h2>
              <p className="text-sm text-muted-foreground">
                Sua conta está pronta. Crie sua primeira loja para começar a receber agendamentos.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="btn-salmon flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-[9px] relative sm:shrink-0"
            >
              <Plus className="size-4" />
              Criar minha loja
            </button>
          </div>
        )}

        {/*  Stats row  */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-7">
          <StatCard
            label="Lojas"
            icon={<Store className="size-4 text-chart-3" />}
            iconBg="bg-muted"
            value={String(lojas.length)}
            sub="cadastradas"
          />
          <StatCard
            label="Profissionais"
            icon={<Users className="size-4 text-blue-500" />}
            iconBg="bg-blue-50"
            value={String(profCount)}
            sub="vinculados"
          />
          <StatCard
            label="Serviços"
            icon={<ClipboardList className="size-4 text-violet-500" />}
            iconBg="bg-violet-50"
            value={String(serviceCount)}
            sub="cadastrados"
          />
          <StatCard
            label="Agendamentos"
            icon={<Calendar className="size-4 text-emerald-600" />}
            iconBg="bg-emerald-50"
            value={aptsLoading ? "…" : String(apptTotal)}
            sub="no total"
          />
        </div>

        {/*  Main sections (only when stores exist)  */}
        {hasLojas && (
          <>
            {/* Row 1: Stores + Team */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
              {/* Minhas Lojas — 2/3 */}
              <div className="xl:col-span-2 rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border">
                  <h2 className="font-heading font-bold text-slate-900 text-[1.05rem] tracking-[-0.02em]">
                    Minhas Lojas
                  </h2>

                  <button
                    type="button"
                    onClick={openCreate}
                    className="btn-salmon flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-[9px]"
                  >
                    <Plus className="size-3.5" />
                    Nova loja
                  </button>
                </div>
                <div className="p-3 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lojas.map((store) => (
                    <DashboardStoreCard key={store.id} store={store} onEdit={openEdit} />
                  ))}
                </div>
              </div>

              {/* Equipa — 1/3 */}
              <div className="rounded-2xl border border-border bg-card flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h2 className="font-heading font-bold text-slate-900 text-[1.05rem] tracking-[-0.02em]">
                    Equipa
                  </h2>
                  <Link
                    to="/admin/professionals"
                    className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    Ver todos
                  </Link>
                </div>
                <div className="flex-1 p-3 space-y-0.5">
                  {professionals.slice(0, 6).map((p) => (
                    <ProfRow key={p.id} prof={p} />
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-border">
                  <Link
                    to="/admin/professionals"
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl border border-input hover:bg-muted transition-colors text-slate-700"
                  >
                    <Plus className="size-3.5" />
                    Adicionar profissional
                  </Link>
                </div>
              </div>
            </div>

            {/* Row 2: Appointments + Services */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-5">
              {/* Agendamentos recentes — 2/3 */}
              <div className="xl:col-span-2 rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div>
                    <h2 className="font-heading font-bold text-slate-900 text-[1.05rem] tracking-[-0.02em]">
                      Agendamentos
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Próximos e recentes</p>
                  </div>
                  <Link
                    to="/admin/agenda"
                    className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    Ver todos
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {aptsLoading ? (
                    <div className="py-12 flex items-center justify-center">
                      <div className="size-6 rounded-full border-2 border-border border-t-primary animate-spin" />
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm text-slate-400">Nenhum agendamento ainda</p>
                    </div>
                  ) : (
                    appointments.slice(0, 6).map((appt) => <ApptRow key={appt.id} appt={appt} />)
                  )}
                </div>
              </div>

              {/* Serviços — 1/3 */}
              <div className="rounded-2xl border border-border bg-card flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h2 className="font-heading font-bold text-slate-900 text-[1.05rem] tracking-[-0.02em]">
                    Serviços
                  </h2>
                  <Link
                    to="/admin/servicos"
                    className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    Ver todos
                  </Link>
                </div>
                <div className="flex-1 divide-y divide-border">
                  {serviceRows.slice(0, 8).map((row) => (
                    <ServiceRow key={`${row.professional_id}-${row.service_id}`} row={row} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/*  O que você vai poder fazer (empty state only)  */}
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
                icon={<Users className="text-chart-3 size-5" />}
                tag="Passo 2"
                tagStyle="bg-slate-100 text-slate-500"
                title="Cadastrar profissionais"
                description="Adicione os profissionais da sua equipe com bio, foto e disponibilidade individual de horários."
              />
              <FeatureCard
                iconBg="bg-blue-50"
                icon={<ClipboardList className="text-blue-600 size-5" />}
                tag="Passo 3"
                tagStyle="bg-slate-100 text-slate-500"
                title="Configurar serviços"
                description="Defina serviços com nome, preço e duração. Cada profissional pode ter o seu próprio catálogo."
              />
              <FeatureCard
                iconBg="bg-emerald-50"
                icon={<Calendar className="text-green-600 size-5" />}
                tag="Resultado"
                tagStyle="bg-emerald-100 text-emerald-700"
                title="Receber agendamentos"
                description="Sua loja aparece na listagem pública do Agendei e clientes podem reservar horários 24h por dia."
              />
            </div>
          </>
        )}
      </main>

      <StoreFormDialog
        key={storeDialog.store?.id ?? "create"}
        open={storeDialog.open}
        onOpenChange={(open) => setStoreDialog((prev) => ({ ...prev, open }))}
        mode={storeDialog.mode}
        storeId={storeDialog.store?.id}
        defaultValues={
          storeDialog.store
            ? {
                name: storeDialog.store.name,
                description: storeDialog.store.description ?? "",
                phone: storeDialog.store.phone ?? "",
                email: storeDialog.store.email ?? "",
                address: storeDialog.store.address ?? "",
                logo_url: storeDialog.store.logo_url ?? "",
              }
            : undefined
        }
      />
    </div>
  );
}

// Sub Components
interface StatCardProps {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  sub: string;
}

function StatCard({ label, icon, iconBg, value, sub }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className={`size-8 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
      </div>
      <p className="font-heading font-bold text-3xl tracking-[-0.03em] text-slate-900">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

interface DashboardStoreCardProps {
  store: StoreDTO;
  onEdit: (store: StoreDTO) => void;
}

function DashboardStoreCard({ store, onEdit }: DashboardStoreCardProps) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden transition-all hover:border-salmon-200 hover:shadow-salmon-card">
      <div
        className={`h-24 bg-linear-to-br from-salmon-100 to-salmon-200 relative flex items-end p-3.5`}
      >
        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-white text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
          {store.is_active ? "Ativa" : "Inativa"}
        </span>
        <div className="size-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <Store className="size-5 text-chart-3" />
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-slate-900">{store.name}</p>
        {store.address && (
          <p className="text-xs text-muted-foreground mt-0.5 mb-3 flex items-center gap-1">
            <MapPin className="size-2.5 shrink-0" />
            {store.address}
          </p>
        )}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-muted text-chart-3">
            {store.professional_count} profissional{store.professional_count !== 1 ? "is" : ""}
          </span>
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {store.service_count} serviço{store.service_count !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => onEdit(store)}
            className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg border border-input hover:bg-muted transition-colors text-slate-700"
          >
            <Pencil className="size-3" /> Editar
          </button>
          <Link
            to="/admin/professionals"
            className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg border border-input hover:bg-muted transition-colors text-slate-700"
          >
            <Users className="size-3" /> Equipe
          </Link>
          <Link
            to="/admin/servicos"
            className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg border border-input hover:bg-muted transition-colors text-slate-700"
          >
            <ClipboardList className="size-3" /> Serviços
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProfRow({ prof }: { prof: ProfessionalWithStoreDTO }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="size-8 rounded-full bg-salmon-100 text-chart-4 flex items-center justify-center text-[0.7rem] font-bold shrink-0">
        {getInitials(prof.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 truncate">{prof.name}</p>
        <p className="text-xs text-muted-foreground truncate">{prof.store_name}</p>
      </div>
    </div>
  );
}

function apptDateLabel(isoString: string): string {
  const d = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return "Hoje";
  if (sameDay(d, tomorrow)) return "Amanhã";
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
}

function ApptRow({ appt }: { appt: AppointmentAdminDTO }) {
  // Verificar se existe algo semelhante em algum local para tornar uma utilidade compartilhada, talvez no próprio StatusBadge ou algo do tipo
  const time = new Date(appt.starts_at).toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isCancelled = appt.status === "cancelled";

  return (
    <div className="flex items-center gap-4 px-3 md:px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
      <div
        className={`flex size-9 rounded-full items-center justify-center text-xs font-bold shrink-0 ${isCancelled ? "bg-red-100 text-red-700" : "bg-salmon-100 text-chart-4"}`}
      >
        {getInitials(appt.client_name ?? "—")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold text-slate-900 ${isCancelled ? "opacity-60" : ""}`}>
            {appt.client_name ?? "—"}
          </p>
          <StatusBadge status={appt.status} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {appt.service_name} · com {appt.professional_name} · {appt.store_name}
        </p>
      </div>
      <div className="text-center">
        <div className="shrink-0">
          <p
            className={`text-xs font-semibold ${isCancelled ? "text-slate-400" : "text-slate-700"}`}
          >
            {apptDateLabel(appt.starts_at)}
          </p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
        {appt.price && !isCancelled && (
          <p className="text-sm font-bold shrink-0 text-chart-3">
            {Number(appt.price).toFixed(0)} €
          </p>
        )}
      </div>
    </div>
  );
}

function ServiceRow({ row }: { row: StoreServiceDTO }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/60 transition-colors">
      <div>
        <p className="text-xs font-semibold text-slate-900">{row.service_name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {row.professional_name} · {row.duration_minutes} min
        </p>
      </div>
      <p className="text-sm font-bold text-chart-3">{Number(row.price).toFixed(0)} €</p>
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

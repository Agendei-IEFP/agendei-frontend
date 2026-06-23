import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/format";
import { formatTime } from "@/lib/agenda";
import { useMyProfessionalAppointments } from "@/hooks/useAppointments";
import { AppointmentDetailModal } from "@/components/agenda/AppointmentDetailModal";
import { appointmentsForDay, toLocal } from "@/lib/agenda";
import { AppointmentStatus } from "@/types/enums";
import type { AppointmentDTO } from "@/types/api";

export const Route = createFileRoute("/professional/dashboard")({
  component: Dashboard,
});

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameCalendarDay(date, new Date());
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

const STATUS_CHIP: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmado", className: "bg-green-100 text-green-700" },
  completed: { label: "Concluído", className: "bg-muted text-muted-foreground" },
  cancelled: { label: "Cancelado", className: "bg-red-100 text-red-700" },
};

const WEEKDAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [date, setDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);

  const { data: appointments = [], isLoading } = useMyProfessionalAppointments();

  const firstName = user?.name?.split(" ")[0] ?? "Profissional";

  function shift(days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d);
  }

  const dayAppointments = appointmentsForDay(appointments, date);
  const confirmed = dayAppointments.filter((a) => a.status === AppointmentStatus.confirmed);
  const cancelled = dayAppointments.filter((a) => a.status === AppointmentStatus.cancelled);

  const now = new Date();
  const nextAppt = confirmed.filter((a) => toLocal(a.starts_at) > now).at(0);

  const totalMinutes = confirmed.reduce((s, a) => s + (a.duration_minutes ?? 0), 0);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const weekCounts = weekDays.map((d) => ({
    date: d,
    count: appointmentsForDay(appointments, d).filter(
      (a) => a.status === AppointmentStatus.confirmed,
    ).length,
  }));

  const today = isToday(date);
  const countLabel = `${confirmed.length} agendamento${confirmed.length !== 1 ? "s" : ""}`;

  return (
    <>
      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold mb-0.5 text-chart-3">{greeting()}</p>
            <h2 className="font-heading font-bold text-foreground text-2xl tracking-tight">
              {firstName}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => shift(-1)}
              className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white border border-border transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="px-4 py-2 rounded-xl text-center bg-white border border-border min-w-45">
              <p className="text-sm font-bold text-foreground">{formatDate(date)}</p>
              <p className="text-xs font-medium text-chart-3">
                {today ? `Hoje · ${countLabel}` : countLabel}
              </p>
            </div>
            <button
              onClick={() => shift(1)}
              className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white border border-border transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-2xl font-bold leading-none mb-1 text-chart-3">
              {isLoading ? "—" : confirmed.length}
            </p>
            <p className="text-xs text-muted-foreground">agendamentos hoje</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xl font-bold text-foreground leading-none mb-1">
              {isLoading || !nextAppt ? "—" : formatTime(toLocal(nextAppt.starts_at))}
            </p>
            <p className="text-xs text-muted-foreground">próximo atendimento</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xl font-bold text-foreground leading-none mb-1">
              {isLoading ? "—" : totalMinutes > 0 ? formatDuration(totalMinutes) : "—"}
            </p>
            <p className="text-xs text-muted-foreground">em atendimentos</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xl font-bold text-muted-foreground leading-none mb-1">
              {isLoading ? "—" : cancelled.length}
            </p>
            <p className="text-xs text-muted-foreground">cancelamentos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-warm mb-3">
              Agenda do dia
            </p>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="size-7 animate-spin rounded-full border-2 border-border border-t-primary" />
              </div>
            ) : dayAppointments.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
                <p className="font-semibold text-foreground mb-1">Nenhum agendamento</p>
                <p className="text-sm text-muted-foreground">Sem atendimentos para este dia.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {dayAppointments.map((appt) => {
                  const chip = STATUS_CHIP[appt.status];
                  const isCancelled = appt.status === AppointmentStatus.cancelled;
                  return (
                    <button
                      key={appt.id}
                      onClick={() => setSelectedAppointment(appt)}
                      className={cn(
                        "w-full text-left flex gap-3.5 p-3.5 rounded-2xl border bg-white transition-all",
                        isCancelled
                          ? "opacity-50 border-border pointer-events-none"
                          : "border-border hover:border-salmon-200 hover:shadow-[0_4px_16px_rgba(224,80,64,0.08)] cursor-pointer",
                      )}
                    >
                      <div className="flex flex-col items-center shrink-0 pt-0.5 w-10">
                        <span className="text-xs font-bold text-foreground">
                          {formatTime(toLocal(appt.starts_at))}
                        </span>
                        <div className="w-px flex-1 mt-2 bg-border min-h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {appt.client_name ?? "Cliente"}
                            </p>
                            {appt.service_name && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {appt.service_name}
                                {appt.duration_minutes ? ` · ${appt.duration_minutes} min` : ""}
                              </p>
                            )}
                          </div>
                          <span
                            className={cn(
                              "shrink-0 text-[0.65rem] font-bold px-2 py-0.5 rounded-full",
                              chip.className,
                            )}
                          >
                            {chip.label}
                          </span>
                        </div>

                        {(appt.client_phone ?? appt.client_email) && (
                          <p className="text-xs text-muted-foreground truncate">
                            {appt.client_phone ?? appt.client_email}
                          </p>
                        )}
                      </div>

                      {!isCancelled && (
                        <ChevronRight className="size-4 text-border shrink-0 self-center" />
                      )}
                    </button>
                  );
                })}

                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-border" />
                  <p className="text-xs text-muted-foreground/50 font-medium shrink-0">
                    Fim do dia
                  </p>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-warm mb-3">
                Esta semana
              </p>
              <div className="space-y-0">
                {weekCounts.map(({ date: d, count }, i) => {
                  const isLast = i === weekCounts.length - 1;
                  return (
                    <div
                      key={d.toISOString()}
                      className={cn(
                        "flex items-center justify-between py-2",
                        !isLast && "border-b border-border",
                      )}
                    >
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {isSameCalendarDay(d, new Date()) ? "Hoje" : WEEKDAY_SHORT[d.getDay()]},{" "}
                          {d.getDate()} {MONTH_SHORT[d.getMonth()]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {count} agendamento{count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-[0.65rem] font-bold px-2 py-0.5 rounded-full",
                          count > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-warm mb-3">
                Ações rápidas
              </p>
              <Link
                to="/professional/services"
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="size-8 rounded-lg flex items-center justify-center shrink-0 bg-salmon-100">
                  <Tag className="size-4 text-chart-3" />
                </div>
                <p className="text-sm font-medium text-foreground">Meus Serviços</p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <AppointmentDetailModal
        appointment={selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      />
    </>
  );
}

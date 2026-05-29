import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useMyProfessionalAppointments } from "@/hooks/useAppointments";
import { AppointmentCard } from "@/components/agendamentos/AppointmentCard";
import type { AppointmentDTO } from "@/types/api";

export const Route = createFileRoute("/professional/agenda")({
  component: Agenda,
});

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function isSameDay(isoUtc: string, localDate: Date): boolean {
  const d = new Date(isoUtc);
  return (
    d.getFullYear() === localDate.getFullYear() &&
    d.getMonth() === localDate.getMonth() &&
    d.getDate() === localDate.getDate()
  );
}

function Agenda() {
  const [date, setDate] = useState(new Date());
  const { data: appointments, isLoading } = useMyProfessionalAppointments();

  function shift(days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d);
  }

  const dayAppointments: AppointmentDTO[] = (appointments ?? [])
    .filter((a) => isSameDay(a.starts_at, date))
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());

  return (
    <main className="flex-1 p-4 md:p-8">
      {/* Header + date nav */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold mb-0.5 text-chart-3">Agenda</p>
          <h2 className="font-heading font-bold text-foreground text-2xl tracking-tight">
            Meus Agendamentos
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
            <p className="text-xs font-medium text-chart-3">{isToday(date) ? "Hoje" : ""}</p>
          </div>
          <button
            onClick={() => shift(1)}
            className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white border border-border transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : dayAppointments.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
            <CalendarDays className="size-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground mb-1">Nenhum agendamento neste dia</p>
          <p className="text-sm text-muted-foreground">
            Quando houver agendamentos, eles aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayAppointments.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}
    </main>
  );
}

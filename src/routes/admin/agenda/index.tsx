import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { useMyStores } from "@/hooks/useStores";
import { useStoreAppointments } from "@/hooks/useAppointments";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { AppointmentStatus } from "@/types/enums";

export const Route = createFileRoute("/admin/agenda/")({
  component: AdminAgenda,
});

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  confirmed: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
};

function AdminAgenda() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const { data: stores = [] } = useMyStores();

  const activeStoreId = selectedStoreId ?? stores[0]?.id ?? "";

  const dateStr = toDateString(selectedDate);
  const { data: appointments = [], isLoading } = useStoreAppointments(activeStoreId, dateStr);

  function prevDay() {
    setSelectedDate((d) => {
      const prev = new Date(d);
      prev.setDate(prev.getDate() - 1);
      return prev;
    });
  }

  function nextDay() {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }

  const isToday = toDateString(selectedDate) === toDateString(today);

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <SidebarTrigger className="-ml-1" />
        <div>
          <h1 className="font-heading font-extrabold tracking-tight text-foreground text-lg">
            Agendamentos
          </h1>
          <p className="text-xs text-muted-foreground capitalize">{formatDate(selectedDate)}</p>
        </div>
      </header>

      <div className="flex-1 px-6 py-5 space-y-5 max-w-3xl w-full mx-auto">
        
        {stores.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {stores.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => setSelectedStoreId(store.id)}
                className={cn(
                  "chip transition-colors",
                  (selectedStoreId ?? stores[0]?.id) === store.id
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-salmon-100",
                )}
              >
                {store.name}
              </button>
            ))}
          </div>
        )}

        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevDay}
            className="size-8 flex items-center justify-center rounded-lg border border-input bg-white hover:bg-muted transition-colors"
          >
            <ChevronLeft className="size-4 text-muted-foreground" />
          </button>
          <span className="text-sm font-semibold text-foreground capitalize flex-1 text-center">
            {isToday ? "Hoje" : formatDate(selectedDate)}
          </span>
          <button
            type="button"
            onClick={nextDay}
            className="size-8 flex items-center justify-center rounded-lg border border-input bg-white hover:bg-muted transition-colors"
          >
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </div>

        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <Calendar className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Nenhum agendamento para este dia
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-start gap-4"
              >
                
                <div className="shrink-0 text-center min-w-[52px]">
                  <p className="text-sm font-bold text-foreground">{formatTime(appt.starts_at)}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(appt.ends_at)}</p>
                </div>

                
                <div className="w-px self-stretch bg-border" />

                
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {appt.service_name ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appt.professional_name ?? "—"} · {appt.client_name ?? "—"}
                  </p>
                  {appt.duration_minutes != null && (
                    <p className="text-xs text-muted-warm">{appt.duration_minutes} min</p>
                  )}
                </div>

                
                <span
                  className={cn(
                    "chip shrink-0 self-start",
                    STATUS_STYLES[appt.status as AppointmentStatus],
                  )}
                >
                  {STATUS_LABELS[appt.status as AppointmentStatus]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

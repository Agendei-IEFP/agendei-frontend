import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/professional/dashboard")({
  component: Dashboard,
});

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [date, setDate] = useState(new Date());

  const firstName = user?.name?.split(" ")[0] ?? "Profissional";

  function shift(days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d);
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      {/* Greeting + date nav */}
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

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-2xl font-bold leading-none mb-1 text-chart-3">—</p>
          <p className="text-xs text-muted-foreground">agendamentos hoje</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xl font-bold text-foreground leading-none mb-1">—</p>
          <p className="text-xs text-muted-foreground">próximo atendimento</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xl font-bold text-foreground leading-none mb-1">—</p>
          <p className="text-xs text-muted-foreground">em atendimentos</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-center gap-3">
          <div className="size-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Clock className="size-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-amber-600 leading-none mb-0.5">—</p>
            <p className="text-xs text-muted-foreground">pendentes</p>
          </div>
        </div>
      </div>

      {/* Empty state para agendamentos */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="size-6 text-muted-foreground" />
        </div>
        <p className="font-semibold text-foreground mb-1">Agenda em breve</p>
        <p className="text-sm text-muted-foreground">
          Os agendamentos do dia aparecerão aqui quando o módulo de agenda estiver disponível.
        </p>
      </div>
    </main>
  );
}

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppointmentDTO } from "@/types/api";
import { StatusBadge } from "./StatusBadge";

interface AppointmentCardProps {
  appointment: AppointmentDTO;
  className?: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}

export function AppointmentCard({ appointment, className }: AppointmentCardProps) {
  const start = formatTime(appointment.starts_at);
  const end = formatTime(appointment.ends_at);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm flex items-center gap-4",
        className,
      )}
    >
      <div className="size-10 rounded-xl bg-salmon-100 flex items-center justify-center shrink-0">
        <Clock className="size-4 text-chart-3" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {start} – {end}
        </p>
        <p className="text-xs text-muted-foreground truncate">ID: {appointment.id.slice(0, 8)}…</p>
      </div>

      <StatusBadge status={appointment.status} />
    </div>
  );
}

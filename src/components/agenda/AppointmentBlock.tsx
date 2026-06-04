import { cn } from "@/lib/utils";
import { formatTime, toLocal } from "@/lib/agenda";
import type { AppointmentDTO } from "@/types/api";
import { AppointmentStatus } from "@/types/enums";

interface AppointmentBlockProps {
  appointment: AppointmentDTO;
  className?: string;
}

type BlockVariant = "occupied" | "completed" | "cancelled";

function getVariant(appt: AppointmentDTO): BlockVariant {
  if (appt.status === AppointmentStatus.cancelled) return "cancelled";
  if (appt.status === AppointmentStatus.completed) return "completed";
  return "occupied";
}

export function AppointmentBlock({ appointment, className }: AppointmentBlockProps) {
  const variant = getVariant(appointment);
  const start = formatTime(toLocal(appointment.starts_at));
  const end = formatTime(toLocal(appointment.ends_at));
  const clientName = appointment.client_name ?? "Cliente";
  const serviceName = appointment.service_name ?? null;
  const durationMin = appointment.duration_minutes ?? null;
  const storeName = appointment.store_name ?? null;

  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2.5",
        variant === "occupied" && "bg-salmon-100 border-l-4 border-chart-3",
        variant === "completed" && "bg-muted border-l-4 border-border opacity-65",
        variant === "cancelled" && "appt-cancelled bg-red-50 border-l-4 border-red-200",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "text-sm font-bold leading-snug truncate",
                variant === "occupied" && "text-chart-4",
                variant === "completed" && "text-muted-foreground",
                variant === "cancelled" && "text-red-800 line-through opacity-70",
              )}
            >
              {clientName}
            </p>
            {variant === "cancelled" && (
              <span className="shrink-0 text-[0.6rem] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                Cancelado
              </span>
            )}
          </div>

          {serviceName && (
            <p
              className={cn(
                "text-xs mt-0.5 truncate",
                variant === "occupied" && "text-muted-foreground",
                variant === "completed" && "text-muted-foreground/70",
                variant === "cancelled" && "text-red-400",
              )}
            >
              {serviceName}
              {durationMin && ` · ${durationMin} min`}
            </p>
          )}

          {storeName && (
            <p
              className={cn(
                "text-xs mt-0.5 truncate",
                variant === "occupied" && "text-muted-warm",
                variant === "completed" && "text-muted-foreground/50",
                variant === "cancelled" && "text-red-300",
              )}
            >
              {storeName}
            </p>
          )}
        </div>

        <p
          className={cn(
            "text-xs shrink-0 pt-0.5",
            variant === "occupied" && "text-muted-foreground",
            variant === "completed" && "text-muted-foreground/60",
            variant === "cancelled" && "text-red-300",
          )}
        >
          {start}–{end}
        </p>
      </div>
    </div>
  );
}

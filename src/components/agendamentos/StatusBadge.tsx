import { cn } from "@/lib/utils";
import { AppointmentStatus } from "@/types/enums";

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: { label: "Pendente", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmado", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelado", className: "bg-red-100 text-red-600" },
  completed: { label: "Concluído", className: "bg-muted text-muted-foreground" },
};

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

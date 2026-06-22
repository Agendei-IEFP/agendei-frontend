import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentStatus } from "@/types/enums";
import type { AppointmentDTO } from "@/types/api";
import { useCancelAppointment } from "@/hooks/useAppointments";
import { formatTime, toLocal } from "@/lib/agenda";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AppointmentDetailModalProps {
  appointment: AppointmentDTO | null;
  onOpenChange: (open: boolean) => void;
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  [AppointmentStatus.confirmed]: "Confirmado",
  [AppointmentStatus.completed]: "Concluído",
  [AppointmentStatus.cancelled]: "Cancelado",
};

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  [AppointmentStatus.confirmed]: "bg-green-100 text-green-700",
  [AppointmentStatus.completed]: "bg-muted text-muted-foreground",
  [AppointmentStatus.cancelled]: "bg-red-100 text-red-700",
};

export function AppointmentDetailModal({ appointment, onOpenChange }: AppointmentDetailModalProps) {
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");
  const { mutate: cancelAppt, isPending } = useCancelAppointment();

  function handleClose() {
    setCancelling(false);
    setReason("");
    onOpenChange(false);
  }

  function handleCancel() {
    if (!appointment) return;
    cancelAppt(
      { id: appointment.id, reason: reason.trim() || undefined },
      { onSuccess: handleClose },
    );
  }

  if (!appointment) return null;

  const start = formatTime(toLocal(appointment.starts_at));
  const end = formatTime(toLocal(appointment.ends_at));
  const clientName = appointment.client_name ?? "Cliente";
  const contact = appointment.client_phone ?? appointment.client_email ?? null;
  const isPhone = !!appointment.client_phone;
  const isConfirmed = appointment.status === AppointmentStatus.confirmed;

  return (
    <Dialog open={!!appointment} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">{clientName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-1">
          
          <div className="flex items-start justify-between gap-2">
            <div>
              {appointment.service_name && (
                <p className="text-sm font-semibold text-foreground">
                  {appointment.service_name}
                  {appointment.duration_minutes && (
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      · {appointment.duration_minutes} min
                    </span>
                  )}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">
                {start} – {end}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 text-[0.65rem] font-bold px-2 py-0.5 rounded-full",
                STATUS_STYLE[appointment.status],
              )}
            >
              {STATUS_LABEL[appointment.status]}
            </span>
          </div>

          
          {contact && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isPhone ? (
                <Phone className="size-3.5 shrink-0" />
              ) : (
                <Mail className="size-3.5 shrink-0" />
              )}
              <span>{contact}</span>
            </div>
          )}

          
          {appointment.status === AppointmentStatus.cancelled &&
            appointment.cancellation_reason && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                <p className="text-xs text-red-500 font-semibold mb-0.5">Motivo do cancelamento</p>
                <p className="text-xs text-red-700">{appointment.cancellation_reason}</p>
              </div>
            )}

          
          {isConfirmed && !cancelling && (
            <button
              onClick={() => setCancelling(true)}
              className="text-xs font-semibold text-destructive hover:underline text-left mt-1"
            >
              Cancelar agendamento
            </button>
          )}

          {cancelling && (
            <div className="flex flex-col gap-2 pt-1">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Motivo do cancelamento (opcional)"
                rows={3}
                className={cn(
                  "w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground resize-none",
                  "placeholder:text-muted-foreground",
                  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20",
                  "transition-colors duration-150",
                )}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-destructive py-2 text-xs font-bold text-white disabled:opacity-50"
                >
                  {isPending ? "Cancelando…" : "Confirmar cancelamento"}
                </button>
                <button
                  onClick={() => setCancelling(false)}
                  className="px-3 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

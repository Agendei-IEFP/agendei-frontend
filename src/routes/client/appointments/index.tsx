import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatPrice } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { useMyAppointments, useCancelAppointment } from "@/hooks/useAppointments";
import type { AppointmentDTO } from "@/types/api";
import type { AppointmentStatus } from "@/types/enums";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/client/appointments/")({
  component: ClientAppointmentsPage,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Concluído",
};

const STATUS_CLASSES: Record<AppointmentStatus, string> = {
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-slate-100 text-slate-600",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

function parseLocalDate(iso: string): Date {
  return new Date(iso);
}

// ---------------------------------------------------------------------------
// Cancel dialog
// ---------------------------------------------------------------------------

interface CancelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

function CancelDialog({ open, onClose, onConfirm, isPending }: CancelDialogProps) {
  const [reason, setReason] = useState("");

  function handleConfirm() {
    onConfirm(reason.trim());
    setReason("");
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
          <AlertDialogDescription>
            Tens a certeza que queres cancelar? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder="Motivo (opcional)"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            Voltar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? "A cancelar..." : "Cancelar agendamento"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------------------------------------------------------------------------
// Appointment card
// ---------------------------------------------------------------------------

interface AppointmentCardProps {
  appointment: AppointmentDTO;
  onCancel: (id: string) => void;
}

function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const apt = appointment;
  const canCancel = apt.status === "confirmed";
  const parsedDate = parseLocalDate(apt.starts_at);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">
            {apt.service_name ?? "Serviço"}
          </p>
          {apt.store_name && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="size-3 shrink-0" />
              {apt.store_name}
            </p>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full",
            STATUS_CLASSES[apt.status],
          )}
        >
          {STATUS_LABELS[apt.status]}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="size-3 shrink-0" />
          {apt.professional_name ?? "Profissional"}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3 shrink-0" />
          {formatDate(parsedDate)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3 shrink-0" />
          {formatTime(apt.starts_at)} – {formatTime(apt.ends_at)}
        </span>
        {apt.price && (
          <span className="font-semibold text-foreground">{formatPrice(apt.price)}</span>
        )}
      </div>

      {apt.status === "cancelled" && apt.cancellation_reason && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
          <span className="font-semibold">Motivo do cancelamento: </span>
          {apt.cancellation_reason}
        </div>
      )}

      {apt.notes && (
        <p className="text-xs text-muted-foreground italic">&ldquo;{apt.notes}&rdquo;</p>
      )}

      {canCancel && (
        <button
          onClick={() => onCancel(apt.id)}
          className="self-start text-xs font-medium text-destructive hover:underline"
        >
          Cancelar agendamento
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ClientAppointmentsPage() {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const { data: appointments, isLoading } = useMyAppointments();
  const cancelMutation = useCancelAppointment();

  async function handleCancel(reason: string) {
    if (!cancelId) return;
    setCancelError(null);
    try {
      await cancelMutation.mutateAsync({ id: cancelId, reason: reason || undefined });
      setCancelId(null);
    } catch (err) {
      setCancelError(getApiErrorMessage(err));
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <h1 className="font-heading font-extrabold text-xl text-foreground mb-4">
        Os meus agendamentos
      </h1>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && (!appointments || appointments.length === 0) && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <CalendarDays className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Ainda não tens agendamentos.</p>
        </div>
      )}

      {cancelError && <p className="text-sm text-destructive mb-3">{cancelError}</p>}

      <div className="flex flex-col gap-3">
        {appointments?.map((apt) => (
          <AppointmentCard key={apt.id} appointment={apt} onCancel={setCancelId} />
        ))}
      </div>

      <CancelDialog
        open={cancelId !== null}
        onClose={() => {
          setCancelId(null);
          setCancelError(null);
        }}
        onConfirm={handleCancel}
        isPending={cancelMutation.isPending}
      />
    </div>
  );
}

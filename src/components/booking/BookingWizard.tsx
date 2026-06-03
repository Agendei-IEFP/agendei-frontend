import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatPrice, getInitials } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { useBookingStore } from "@/store/bookingStore";
import { useStoreProfessionals } from "@/hooks/useStores";
import { useOfferings } from "@/hooks/useServices";
import { useAvailableSlots } from "@/hooks/useSlots";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + "T12:00:00");
}

// ---------------------------------------------------------------------------
// Micro-components
// ---------------------------------------------------------------------------

function SkeletonList({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />
      ))}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function CtaButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <Button
      type={type}
      size="lg"
      disabled={disabled}
      onClick={onClick}
      className="bg-linear-to-br from-chart-3 to-primary text-white shadow-[0_3px_14px_rgba(224,80,64,0.28)] disabled:opacity-50"
    >
      {children}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

const STEP_LABELS = ["Profissional & Serviço", "Data & Horário", "Confirmação"];

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-2 mb-2">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = step >= n;
        return (
          <div key={n} className="flex-1 flex flex-col gap-1">
            <div className={cn("h-1 rounded-full", active ? "bg-primary" : "bg-border")} />
            <span
              className={cn(
                "text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Professional & Service
// ---------------------------------------------------------------------------

function Step1({ storeId }: { storeId: string }) {
  const {
    professionalStoreId,
    selectedProfessional,
    selectedOffering,
    setProfessional,
    setOffering,
    closeWizard,
    goStep,
  } = useBookingStore();

  const professionalsQuery = useStoreProfessionals(storeId);
  const offeringsQuery = useOfferings(professionalStoreId);
  const enabledOfferings = offeringsQuery.data?.filter((o) => o.is_enabled) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Profissional
        </p>
        {professionalsQuery.isLoading ? (
          <SkeletonList count={2} />
        ) : (
          <div className="flex flex-col gap-2">
            {professionalsQuery.data?.map((p) => (
              <button
                key={p.id}
                onClick={() => setProfessional(p.professional_store_id, p)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition-colors w-full",
                  !p.is_active && "opacity-40 pointer-events-none",
                  selectedProfessional?.id === p.id && "border-primary bg-muted",
                )}
              >
                {p.photo_url ? (
                  <img
                    src={p.photo_url}
                    alt={p.name}
                    className="size-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="size-10 rounded-full flex items-center justify-center shrink-0 bg-linear-to-br from-chart-3 to-primary text-white text-sm font-bold">
                    {getInitials(p.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                  {p.bio && <p className="text-xs text-muted-foreground truncate">{p.bio}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedProfessional && (
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Serviço
          </p>
          {offeringsQuery.isLoading ? (
            <SkeletonList count={3} />
          ) : enabledOfferings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum serviço disponível.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {enabledOfferings.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOffering(o)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm transition-colors w-full",
                    selectedOffering?.id === o.id && "border-primary bg-muted",
                  )}
                >
                  <span className="text-sm font-medium text-foreground">{o.service.name}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    <span>{formatDuration(o.effective_duration_minutes)}</span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(o.effective_price)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={closeWizard}>
          Cancelar
        </Button>
        <CtaButton disabled={!selectedProfessional || !selectedOffering} onClick={() => goStep(2)}>
          Próximo
        </CtaButton>
      </DialogFooter>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Date & Slot
// ---------------------------------------------------------------------------

function Step2() {
  const {
    professionalStoreId,
    selectedProfessional,
    selectedOffering,
    offeringId,
    date,
    slot,
    setDate,
    setSlot,
    goStep,
  } = useBookingStore();

  const today = new Date().toISOString().split("T")[0];
  const slotsQuery = useAvailableSlots(professionalStoreId, offeringId, date);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {selectedProfessional && (
          <span className="text-xs bg-muted rounded-full px-3 py-1 font-medium">
            {selectedProfessional.name}
          </span>
        )}
        {selectedOffering && (
          <span className="text-xs bg-muted rounded-full px-3 py-1 font-medium">
            {selectedOffering.service.name}
          </span>
        )}
      </div>

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
          Data
        </label>
        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {date && (
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Horário
          </label>
          {slotsQuery.isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-9 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : !slotsQuery.data || slotsQuery.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem disponibilidade neste dia.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slotsQuery.data.map((s) => (
                <button
                  key={s.start}
                  onClick={() => setSlot(s)}
                  className={cn(
                    "rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors",
                    slot?.start === s.start && "border-primary bg-muted",
                  )}
                >
                  {formatTime(s.start)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={() => goStep(1)}>
          Voltar
        </Button>
        <CtaButton disabled={!slot} onClick={() => goStep(3)}>
          Próximo
        </CtaButton>
      </DialogFooter>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Confirm
// ---------------------------------------------------------------------------

function Step3() {
  const {
    professionalStoreId,
    selectedProfessional,
    selectedOffering,
    offeringId,
    date,
    slot,
    notes,
    setNotes,
    goStep,
  } = useBookingStore();

  const [error, setError] = useState<string | null>(null);
  const createAppointment = useCreateAppointment();

  async function handleConfirm() {
    if (!professionalStoreId || !offeringId || !slot) return;
    setError(null);
    try {
      await createAppointment.mutateAsync({
        professional_store_id: professionalStoreId,
        offering_id: offeringId,
        starts_at: slot.start,
        notes: notes || undefined,
      });
      goStep("success");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  const parsedDate = date ? parseLocalDate(date) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col gap-2.5">
        {selectedOffering && <SummaryRow label="Serviço" value={selectedOffering.service.name} />}
        {selectedOffering && (
          <SummaryRow label="Preço" value={formatPrice(selectedOffering.effective_price)} />
        )}
        {selectedProfessional && (
          <SummaryRow label="Profissional" value={selectedProfessional.name} />
        )}
        {parsedDate && <SummaryRow label="Data" value={formatDate(parsedDate)} />}
        {slot && (
          <SummaryRow
            label="Horário"
            value={`${formatTime(slot.start)} – ${formatTime(slot.end)}`}
          />
        )}
        {selectedOffering && (
          <SummaryRow
            label="Duração"
            value={formatDuration(selectedOffering.effective_duration_minutes)}
          />
        )}
      </div>

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
          Observações (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Alguma informação adicional..."
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DialogFooter>
        <Button variant="outline" onClick={() => goStep(2)} disabled={createAppointment.isPending}>
          Voltar
        </Button>
        <CtaButton disabled={createAppointment.isPending} onClick={handleConfirm}>
          {createAppointment.isPending ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white inline-block" />
          ) : (
            "Confirmar"
          )}
        </CtaButton>
      </DialogFooter>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success screen
// ---------------------------------------------------------------------------

function SuccessScreen() {
  const { selectedProfessional, selectedOffering, date, slot, closeWizard } = useBookingStore();
  const navigate = useNavigate();

  const parsedDate = date ? parseLocalDate(date) : null;

  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="size-14 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 className="size-8 text-green-600" />
      </div>
      <div>
        <h3 className="font-heading font-extrabold text-lg text-foreground">
          Agendamento confirmado!
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedOffering?.service.name}
          {selectedProfessional && ` com ${selectedProfessional.name}`}
          {parsedDate && `, ${formatDate(parsedDate)}`}
          {slot && ` às ${formatTime(slot.start)}`}
        </p>
      </div>
      <CtaButton
        onClick={() => {
          void navigate({ to: "/client" });
          closeWizard();
        }}
      >
        Ver meus agendamentos
      </CtaButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BookingWizard — public export
// ---------------------------------------------------------------------------

export function BookingWizard({ storeId }: { storeId: string }) {
  const { open, step, closeWizard } = useBookingStore();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeWizard()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <div className="flex items-center justify-between">
          <DialogTitle className="font-heading font-extrabold text-base text-foreground">
            Agendar
          </DialogTitle>
          <DialogClose asChild>
            <button
              onClick={closeWizard}
              className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-salmon-100 transition-colors"
            >
              <X className="size-4" />
            </button>
          </DialogClose>
        </div>
        {step !== "success" && <ProgressBar step={step} />}
        {step === 1 && <Step1 storeId={storeId} />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === "success" && <SuccessScreen />}
      </DialogContent>
    </Dialog>
  );
}

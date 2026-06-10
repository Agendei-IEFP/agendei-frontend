import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatPrice, getInitials } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { useAuthStore } from "@/store/authStore";
import { useStoreProfessionals, useStoreServices } from "@/hooks/useStores";
import { useAvailableSlots } from "@/hooks/useSlots";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { StoresNavbar } from "@/components/stores/StoresNavbar";
import { Button } from "@/components/ui/button";
import type { StoreProfessionalDTO, StoreServiceDTO } from "@/types/api";

const searchSchema = z.object({
  psid: z.string().optional(),
});

export const Route = createFileRoute("/stores/$storeId/book")({
  validateSearch: searchSchema,
  component: BookPage,
});

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function BookPage() {
  const { storeId } = Route.useParams();
  const { psid } = Route.useSearch();
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [step, setStep] = useState<1 | 2 | 3 | "success">(1);
  const [selectedProfessional, setSelectedProfessional] = useState<StoreProfessionalDTO | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<StoreServiceDTO | null>(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<{ start: string; end: string } | null>(null);
  const [notes, setNotes] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const professionalsQuery = useStoreProfessionals(storeId);
  const storeServicesQuery = useStoreServices(storeId);
  const slotsQuery = useAvailableSlots(
    selectedProfessional?.id ?? null,
    selectedService?.service_id ?? null,
    date,
  );
  const createAppointment = useCreateAppointment();

  // Pre-select professional via psid query param (now professional.id)
  useEffect(() => {
    if (!psid || !professionalsQuery.data) return;
    const match = professionalsQuery.data.find((p) => p.id === psid);
    if (match) setSelectedProfessional(match);
  }, [psid, professionalsQuery.data]);

  useEffect(() => {
    if (!accessToken) {
      void navigate({ to: "/login", search: { redirect: `/stores/${storeId}/book` } });
    }
  }, [accessToken, navigate, storeId]);

  function selectProfessional(p: StoreProfessionalDTO) {
    setSelectedProfessional(p);
    setSelectedService(null);
    setDate("");
    setSlot(null);
  }

  function selectService(s: StoreServiceDTO) {
    setSelectedService(s);
    setDate("");
    setSlot(null);
  }

  async function handleConfirm() {
    if (!selectedProfessional || !selectedService || !slot) return;
    setConfirmError(null);
    try {
      await createAppointment.mutateAsync({
        professional_id: selectedProfessional.id,
        service_id: selectedService.service_id,
        starts_at: slot.start,
        notes: notes || undefined,
      });
      setStep("success");
    } catch (err) {
      setConfirmError(getApiErrorMessage(err));
    }
  }

  if (!accessToken) return null;

  const today = new Date().toISOString().split("T")[0];

  // Services available for the selected professional
  const professionalServices =
    storeServicesQuery.data?.filter(
      (s) => s.professional_id === selectedProfessional?.id,
    ) ?? [];

  const ctaClass =
    "bg-linear-to-br from-chart-3 to-primary text-white shadow-[0_3px_14px_rgba(224,80,64,0.28)] disabled:opacity-50";

  return (
    <>
      <StoresNavbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Link
              to="/stores/$storeId"
              params={{ storeId }}
              className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-heading font-extrabold text-xl text-foreground">Agendar</h1>
          </div>

          {step !== "success" && (
            <div className="flex gap-2 mb-6">
              {["Profissional & Serviço", "Data & Horário", "Confirmação"].map((label, i) => (
                <div key={label} className="flex-1 flex flex-col gap-1">
                  <div
                    className={cn("h-1 rounded-full", step >= i + 1 ? "bg-primary" : "bg-border")}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      step >= i + 1 ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <section>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Profissional
                </p>
                {professionalsQuery.isLoading ? (
                  <div className="flex flex-col gap-2">
                    {[0, 1].map((i) => (
                      <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {professionalsQuery.data?.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectProfessional(p)}
                        disabled={!p.is_active}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition-colors w-full disabled:opacity-40",
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
                          {p.bio && (
                            <p className="text-xs text-muted-foreground truncate">{p.bio}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {selectedProfessional && (
                <section>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Serviço
                  </p>
                  {storeServicesQuery.isLoading ? (
                    <div className="flex flex-col gap-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />
                      ))}
                    </div>
                  ) : professionalServices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum serviço disponível.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {professionalServices.map((s) => (
                        <button
                          key={s.service_id}
                          onClick={() => selectService(s)}
                          className={cn(
                            "flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm transition-colors w-full",
                            selectedService?.service_id === s.service_id &&
                              "border-primary bg-muted",
                          )}
                        >
                          <span className="text-sm font-medium text-foreground">
                            {s.service_name}
                          </span>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                            <span>{formatDuration(s.duration_minutes)}</span>
                            <span className="font-semibold text-foreground">
                              {formatPrice(s.price)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link to="/stores/$storeId" params={{ storeId }}>
                    Cancelar
                  </Link>
                </Button>
                <Button
                  disabled={!selectedProfessional || !selectedService}
                  onClick={() => setStep(2)}
                  className={ctaClass}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-muted rounded-full px-3 py-1 font-medium">
                  {selectedProfessional?.name}
                </span>
                <span className="text-xs bg-muted rounded-full px-3 py-1 font-medium">
                  {selectedService?.service_name}
                </span>
              </div>

              <section>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                  Data
                </label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSlot(null);
                  }}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </section>

              {date && (
                <section>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                    Horário
                  </label>
                  {slotsQuery.isLoading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-9 rounded-xl bg-muted animate-pulse" />
                      ))}
                    </div>
                  ) : !slotsQuery.data?.length ? (
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
                </section>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button disabled={!slot} onClick={() => setStep(3)} className={ctaClass}>
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col gap-2.5">
                {selectedService && <Row label="Serviço" value={selectedService.service_name} />}
                {selectedService && (
                  <Row label="Preço" value={formatPrice(selectedService.price)} />
                )}
                {selectedProfessional && (
                  <Row label="Profissional" value={selectedProfessional.name} />
                )}
                {date && <Row label="Data" value={formatDate(new Date(date + "T12:00:00"))} />}
                {slot && (
                  <Row
                    label="Horário"
                    value={`${formatTime(slot.start)} – ${formatTime(slot.end)}`}
                  />
                )}
                {selectedService && (
                  <Row
                    label="Duração"
                    value={formatDuration(selectedService.duration_minutes)}
                  />
                )}
              </div>

              <section>
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
              </section>

              {confirmError && <p className="text-sm text-destructive">{confirmError}</p>}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={createAppointment.isPending}
                >
                  Voltar
                </Button>
                <Button
                  disabled={createAppointment.isPending}
                  onClick={() => void handleConfirm()}
                  className={ctaClass}
                >
                  {createAppointment.isPending ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white inline-block" />
                  ) : (
                    "Confirmar"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-5 py-8 text-center">
              <div className="size-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-green-600" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-lg text-foreground">
                  Agendamento confirmado!
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedService?.service_name}
                  {selectedProfessional && ` com ${selectedProfessional.name}`}
                  {date && `, ${formatDate(new Date(date + "T12:00:00"))}`}
                  {slot && ` às ${formatTime(slot.start)}`}
                </p>
              </div>
              <Button
                onClick={() => void navigate({ to: "/client/appointments" })}
                className={ctaClass}
              >
                Ver meus agendamentos
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

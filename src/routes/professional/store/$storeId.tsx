import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Store, Clock, Tag, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useMyProfessionalStores,
  useServices,
  useOfferings,
  useCreateOffering,
  useUpdateOffering,
  useDeleteOffering,
  useSchedules,
} from "@/hooks/useServices";
import { useStoreAvailability, useReplaceStoreAvailability } from "@/hooks/useStoreAvailability";
import { WeeklyScheduleGrid } from "@/components/professionals/WeeklyScheduleGrid";
import type { OfferingDTO, WorkScheduleDTO } from "@/types/api";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/professional/store/$storeId")({
  component: StoreView,
});

// ---------------------------------------------------------------------------
// Offering row
// ---------------------------------------------------------------------------

interface OfferingRowProps {
  offering: OfferingDTO;
  professionalStoreId: string;
}

function OfferingRow({ offering, professionalStoreId }: OfferingRowProps) {
  const [editing, setEditing] = useState(false);
  const [priceOverride, setPriceOverride] = useState(offering.price_override ?? "");
  const [durationOverride, setDurationOverride] = useState(
    offering.duration_override?.toString() ?? "",
  );

  const updateOffering = useUpdateOffering(professionalStoreId);
  const deleteOffering = useDeleteOffering(professionalStoreId);

  const hasOverrides = offering.price_override !== null || offering.duration_override !== null;

  async function saveOverrides() {
    await updateOffering.mutateAsync({
      offeringId: offering.id,
      body: {
        price_override: priceOverride.trim() !== "" ? priceOverride : null,
        duration_override: durationOverride.trim() !== "" ? parseInt(durationOverride, 10) : null,
      },
    });
    setEditing(false);
  }

  function toggleEnabled() {
    updateOffering.mutate({ offeringId: offering.id, body: { is_enabled: !offering.is_enabled } });
  }

  const inputClass = cn(
    "rounded-lg border border-input bg-white px-2.5 py-1.5 text-sm text-foreground w-24",
    "focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring/20 transition-colors",
  );

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border transition-all",
        offering.is_enabled ? "border-border bg-card" : "border-border bg-muted/40 opacity-60",
      )}
    >
      {/* Toggle is_enabled */}
      <button
        onClick={toggleEnabled}
        disabled={updateOffering.isPending}
        className={cn(
          "relative inline-flex w-10 h-5 items-center rounded-full transition-colors shrink-0 focus:outline-none",
          offering.is_enabled ? "bg-chart-3" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "inline-block size-3.5 rounded-full bg-white shadow transition-transform mx-0.5",
            offering.is_enabled ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>

      {/* Service name + overrides */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground">{offering.service.name}</p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-chart-3 font-semibold">
            {formatPrice(offering.effective_price)}
            {offering.price_override && (
              <span className="ml-1 text-muted-foreground font-normal line-through text-[10px]">
                {formatPrice(offering.service.default_price)}
              </span>
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {offering.effective_duration_minutes} min
            {offering.duration_override && (
              <span className="ml-1 line-through text-[10px]">
                {offering.service.default_duration_minutes} min
              </span>
            )}
          </span>
          {hasOverrides && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Personalizado
            </span>
          )}
        </div>
      </div>

      {/* Edit inline */}
      {editing ? (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">€</span>
            <input
              value={priceOverride}
              onChange={(e) => setPriceOverride(e.target.value)}
              placeholder={offering.service.default_price}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-1">
            <input
              value={durationOverride}
              onChange={(e) => setDurationOverride(e.target.value)}
              type="number"
              min={15}
              placeholder={offering.service.default_duration_minutes.toString()}
              className={inputClass}
            />
            <span className="text-xs text-muted-foreground">min</span>
          </div>
          <button
            onClick={saveOverrides}
            disabled={updateOffering.isPending}
            className="size-7 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
          >
            <Check className="size-3.5" />
          </button>
          <button
            onClick={() => setEditing(false)}
            className="size-7 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted-foreground/20 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground border border-border hover:bg-muted transition-colors"
          >
            <Pencil className="size-3" />
            Personalizar
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={deleteOffering.isPending}
                className="size-7 flex items-center justify-center rounded-lg text-destructive border border-border hover:bg-red-50 transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover serviço desta loja?</AlertDialogTitle>
                <AlertDialogDescription>
                  "{offering.service.name}" deixará de estar disponível neste estabelecimento.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteOffering.mutate(offering.id)}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Store availability grid (override per store)
// ---------------------------------------------------------------------------

interface StoreScheduleSectionProps {
  professionalStoreId: string;
  baseSchedules: WorkScheduleDTO[];
}

function StoreScheduleSection({ professionalStoreId, baseSchedules }: StoreScheduleSectionProps) {
  const { data: overrides = [], isLoading } = useStoreAvailability(professionalStoreId);
  const replaceAvailability = useReplaceStoreAvailability(professionalStoreId);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  // If overrides exist, show them; otherwise show base schedule as starting point
  const displaySchedules = overrides.length > 0 ? overrides : baseSchedules;

  async function handleSave(
    newBlocks: { weekday: number; start_time: string; end_time: string }[],
  ) {
    setIsSaving(true);
    try {
      await replaceAvailability.mutateAsync(newBlocks);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <WeeklyScheduleGrid
      schedules={displaySchedules}
      isSaving={isSaving}
      onSave={handleSave}
      saveLabel="Salvar horário desta loja"
    />
  );
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

function StoreView() {
  const { storeId } = Route.useParams();
  const [addingService, setAddingService] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const { data: professionalStores = [] } = useMyProfessionalStores();
  const { data: allServices = [] } = useServices();

  const ps = professionalStores.find((p) => p.store_id === storeId);
  const professionalStoreId = ps?.id ?? "";

  const { data: offerings = [], isLoading: offeringsLoading } = useOfferings(professionalStoreId);
  const { data: baseSchedules = [] } = useSchedules(professionalStoreId);
  const createOffering = useCreateOffering(professionalStoreId);

  if (!ps) {
    return (
      <main className="flex-1 p-2 sm:p-4 md:p-8">
        <div className="flex items-center justify-center py-16">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      </main>
    );
  }

  const offeredServiceIds = new Set(offerings.map((o) => o.service_id)); // includes disabled
  const availableToAdd = allServices.filter((s) => s.is_active && !offeredServiceIds.has(s.id));

  async function addOffering() {
    if (!selectedServiceId) return;
    await createOffering.mutateAsync({ service_id: selectedServiceId });
    setSelectedServiceId("");
    setAddingService(false);
  }

  return (
    <main className="flex-1 p-2 sm:p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
          <Store className="size-5 text-chart-3" />
        </div>
        <h2 className="font-heading font-bold text-foreground text-[clamp(1.1rem,5vw,1.5rem)] tracking-tight">
          Gestão - {ps.store.name}
        </h2>
      </div>

      {/* ── Bloco 1: Serviços nesta loja ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-chart-3" />
            <h3 className="font-semibold text-foreground">Serviços nesta loja</h3>
          </div>
          {availableToAdd.length > 0 && (
            <button
              onClick={() => setAddingService(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px transition-all"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:block">Adicionar serviço</span>
            </button>
          )}
        </div>

        {/* Add service panel */}
        {addingService && (
          <div className="mb-4 p-4 rounded-xl border border-salmon-200 bg-salmon-100/40">
            <p className="text-sm font-semibold text-foreground mb-2">Selecionar serviço</p>
            <div className="flex gap-2">
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="flex-1 rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">-- escolher serviço --</option>
                {availableToAdd.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatPrice(s.default_price)} / {s.default_duration_minutes} min
                  </option>
                ))}
              </select>
              <button
                onClick={addOffering}
                disabled={!selectedServiceId || createOffering.isPending}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-chart-3 disabled:opacity-50 transition-colors"
              >
                {createOffering.isPending ? "..." : "Adicionar"}
              </button>
              <button
                onClick={() => setAddingService(false)}
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        {offeringsLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        ) : offerings.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Tag className="size-5 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">Nenhum serviço nesta loja</p>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione serviços canónicos para que os clientes possam agendar.
            </p>
            {availableToAdd.length > 0 && (
              <button
                onClick={() => setAddingService(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px transition-all"
              >
                <Plus className="size-4" />
                Adicionar primeiro serviço
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {offerings.map((offering) => (
              <OfferingRow
                key={offering.id}
                offering={offering}
                professionalStoreId={professionalStoreId}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Bloco 2: Horários desta loja ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-4 text-chart-3" />
          <h3 className="font-semibold text-foreground">Horários de funcionamento</h3>
        </div>

        <div className="rounded-2xl border border-border bg-card p-2 sm:p-4 mb-4">
          <StoreScheduleSection
            professionalStoreId={professionalStoreId}
            baseSchedules={baseSchedules}
          />
        </div>
      </section>
    </main>
  );
}

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyProfessionalStores, useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from "@/hooks/useServices";
import { ScheduleBlockFormDialog } from "@/components/professionals/ScheduleBlockFormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { WorkScheduleDTO } from "@/types/api";
import type { WorkScheduleFormData } from "@/lib/validations/workSchedule";

export const Route = createFileRoute("/professional/schedules")({
  component: Schedules,
});

const WEEKDAYS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

function formatTime(t: string): string {
  return t.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Sub-component: schedule grid for one professional-store
// ---------------------------------------------------------------------------

interface StoreScheduleProps {
  professionalStoreId: string;
}

function StoreSchedule({ professionalStoreId }: StoreScheduleProps) {
  const { data: schedules, isLoading } = useSchedules(professionalStoreId);
  const createSchedule = useCreateSchedule(professionalStoreId);
  const updateSchedule = useUpdateSchedule(professionalStoreId);
  const deleteSchedule = useDeleteSchedule(professionalStoreId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<WorkScheduleDTO | undefined>();
  const [activeWeekday, setActiveWeekday] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<WorkScheduleDTO | null>(null);

  function openCreate(weekday: number) {
    setEditingBlock(undefined);
    setActiveWeekday(weekday);
    setApiError(null);
    setDialogOpen(true);
  }

  function openEdit(block: WorkScheduleDTO) {
    setEditingBlock(block);
    setActiveWeekday(block.weekday);
    setApiError(null);
    setDialogOpen(true);
  }

  async function handleSubmit(data: WorkScheduleFormData) {
    setApiError(null);
    const body = {
      start_time: `${data.start_time}:00`,
      end_time: `${data.end_time}:00`,
    };

    try {
      if (editingBlock) {
        await updateSchedule.mutateAsync({ scheduleId: editingBlock.id, body });
      } else {
        await createSchedule.mutateAsync({ weekday: activeWeekday!, ...body });
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setApiError(typeof detail === "string" ? detail : "Erro ao salvar horário");
    }
  }

  function requestDelete(block: WorkScheduleDTO) {
    setBlockToDelete(block);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!blockToDelete) return;
    await deleteSchedule.mutateAsync(blockToDelete.id);
    setBlockToDelete(null);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  const blocksByDay = WEEKDAYS.reduce<Record<number, WorkScheduleDTO[]>>((acc, _, i) => {
    acc[i] = (schedules ?? [])
      .filter((s) => s.weekday === i)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
    return acc;
  }, {});

  const isSubmitting = createSchedule.isPending || updateSchedule.isPending;

  return (
    <>
      <div className="space-y-3">
        {WEEKDAYS.map((label, weekday) => (
          <div
            key={weekday}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <button
                onClick={() => openCreate(weekday)}
                className="flex items-center gap-1.5 text-xs font-medium text-chart-3 hover:text-chart-4 transition-colors"
              >
                <Plus className="size-3.5" />
                Adicionar bloco
              </button>
            </div>

            {blocksByDay[weekday].length === 0 ? (
              <p className="text-xs text-muted-foreground">Sem horários neste dia</p>
            ) : (
              <div className="space-y-2">
                {blocksByDay[weekday].map((block) => (
                  <div
                    key={block.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted px-3 py-2"
                  >
                    <Clock className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground flex-1">
                      {formatTime(block.start_time)} – {formatTime(block.end_time)}
                    </span>
                    <button
                      onClick={() => openEdit(block)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => requestDelete(block)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <ScheduleBlockFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errorMessage={apiError}
        block={editingBlock}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover bloco de horário"
        description={
          blockToDelete
            ? `Remover o bloco ${formatTime(blockToDelete.start_time)} – ${formatTime(blockToDelete.end_time)}? Esta ação não pode ser desfeita.`
            : "Confirmar remoção?"
        }
        confirmLabel="Remover"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function Schedules() {
  const { data: stores, isLoading } = useMyProfessionalStores();

  if (isLoading) {
    return (
      <main className="flex-1 p-4 md:p-8 flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </main>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <main className="flex-1 p-4 md:p-8">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
            <Clock className="size-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground mb-1">Nenhum estabelecimento vinculado</p>
          <p className="text-sm text-muted-foreground">
            Você precisa estar vinculado a um estabelecimento para configurar horários.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold mb-0.5 text-chart-3">Gestão</p>
        <h2 className="font-heading font-bold text-foreground text-2xl tracking-tight">
          Meus Horários
        </h2>
      </div>

      {stores.length === 1 ? (
        <StoreSchedule professionalStoreId={stores[0].id} />
      ) : (
        <Tabs defaultValue={stores[0].id}>
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            {stores.map((ps) => (
              <TabsTrigger key={ps.id} value={ps.id} className="text-sm">
                {ps.store.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {stores.map((ps) => (
            <TabsContent key={ps.id} value={ps.id}>
              <StoreSchedule professionalStoreId={ps.id} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  );
}

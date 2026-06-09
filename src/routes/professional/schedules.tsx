import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyScheduleGrid } from "@/components/professionals/WeeklyScheduleGrid";
import { useMyProfessionalStores, useSchedules, useReplaceSchedules } from "@/hooks/useServices";

export const Route = createFileRoute("/professional/schedules")({
  component: Schedules,
});

// ---------------------------------------------------------------------------
// Sub-component: grid for one professional-store
// ---------------------------------------------------------------------------

interface StoreScheduleProps {
  professionalStoreId: string;
}

function StoreSchedule({ professionalStoreId }: StoreScheduleProps) {
  const { data: schedules = [], isLoading } = useSchedules(professionalStoreId);
  const replaceSchedules = useReplaceSchedules(professionalStoreId);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  async function handleSave(
    newBlocks: { weekday: number; start_time: string; end_time: string }[],
  ) {
    setIsSaving(true);
    try {
      await replaceSchedules.mutateAsync(newBlocks);
    } finally {
      setIsSaving(false);
    }
  }

  return <WeeklyScheduleGrid schedules={schedules} isSaving={isSaving} onSave={handleSave} />;
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

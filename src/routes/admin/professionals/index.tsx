import { useState } from "react";
import { UserPlus } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProfessionalCard } from "@/components/professionals/ProfessionalCard";
import { InviteModal } from "@/components/professionals/InviteModal";
import { useMyProfessionals } from "@/hooks/useProfessionals";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/professionals/")({
  component: ProfessionalsPage,
});

function ProfessionalsPage() {
  const { data: professionals, isLoading } = useMyProfessionals();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [activeStore, setActiveStore] = useState<string | null>(null);

  const stores = professionals
    ? Array.from(new Map(professionals.map((p) => [p.store_id, p.store_name])).entries())
    : [];

  const filtered =
    activeStore === null ? professionals : professionals?.filter((p) => p.store_id === activeStore);

  const storeCount = stores.length;
  const profCount = professionals?.length ?? 0;

  return (
    <>
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-20 px-4 md:px-8 py-3.5 flex items-center justify-between bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden text-slate-500" />
            <div>
              <h1 className="font-heading font-bold text-foreground text-lg tracking-[-0.02em]">
                Profissionais
              </h1>
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? "Carregando..."
                  : `${profCount} profissional${profCount !== 1 ? "is" : ""} em ${storeCount} loja${storeCount !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setInviteOpen(true)}
            className="gap-2 font-bold text-white btn-salmon text-sm h-auto py-2 px-4"
          >
            <UserPlus className="size-4" />
            Convidar profissional
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {/* Filtro por loja — só aparece com 2+ lojas */}
          {!isLoading && stores.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <button
                type="button"
                onClick={() => setActiveStore(null)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors",
                  activeStore === null
                    ? "bg-chart-3 text-white border-chart-3 shadow-sm"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                Todas as lojas
              </button>
              {stores.map(([storeId, storeName]) => (
                <button
                  key={storeId}
                  type="button"
                  onClick={() => setActiveStore(storeId)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors",
                    activeStore === storeId
                      ? "bg-chart-3 text-white border-chart-3 shadow-sm"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {storeName}
                </button>
              ))}
            </div>
          )}

          {/* Skeletons de loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-2xl" />
              ))}
            </div>
          )}

          {/* Empty state — sem profissionais */}
          {!isLoading && profCount === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <UserPlus className="size-7 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">Nenhum profissional ainda</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Convide profissionais para trabalharem nas suas lojas gerando um link de convite.
              </p>
              <Button
                onClick={() => setInviteOpen(true)}
                className="gap-2 font-bold text-white btn-salmon"
              >
                <UserPlus className="size-4" />
                Convidar primeiro profissional
              </Button>
            </div>
          )}

          {/* Grid de cards */}
          {!isLoading && filtered && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          )}

          {/* Empty state — filtro ativo sem resultados */}
          {!isLoading && filtered && filtered.length === 0 && profCount > 0 && (
            <div className="text-center py-16 text-sm text-muted-foreground">
              Nenhum profissional nesta loja.
            </div>
          )}
        </main>
      </div>

      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}

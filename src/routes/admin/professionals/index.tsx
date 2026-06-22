import { useState } from "react";
import { UserPlus } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProfessionalCard } from "@/components/professionals/ProfessionalCard";
import { CreateProfessionalModal } from "@/components/professionals/CreateProfessionalModal";
import { useMyProfessionals } from "@/hooks/useProfessionals";

export const Route = createFileRoute("/admin/professionals/")({
  component: ProfessionalsPage,
});

function ProfessionalsPage() {
  const { data: professionals, isLoading, refetch } = useMyProfessionals();
  const [createOpen, setCreateOpen] = useState(false);

  const profCount = professionals?.length ?? 0;

  return (
    <>
      <div className="flex flex-col flex-1">
        
        <header className="sticky top-0 z-20 px-4 md:px-8 py-3.5 flex items-center justify-between bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden text-slate-500" />
            <div>
              <h1 className="font-heading font-bold text-foreground text-lg tracking-[-0.02em]">
                Profissionais
              </h1>
            </div>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 font-bold text-white btn-salmon text-sm h-auto py-2 px-4"
          >
            <UserPlus className="size-4" />
            <span className="hidden sm:block">Novo profissional</span>
          </Button>
        </header>

        <main className="flex-1 p-2 md:p-8">
          
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-2xl" />
              ))}
            </div>
          )}

          
          {!isLoading && profCount === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <UserPlus className="size-7 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">Nenhum profissional ainda</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Cadastre profissionais para trabalharem na sua loja.
              </p>
              <Button
                onClick={() => setCreateOpen(true)}
                className="gap-2 font-bold text-white btn-salmon"
              >
                <UserPlus className="size-4" />
                Cadastrar primeiro profissional
              </Button>
            </div>
          )}

          
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {professionals?.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateProfessionalModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => refetch()}
      />
    </>
  );
}

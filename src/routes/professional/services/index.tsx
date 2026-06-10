import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
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
import { useServices, useDeleteService } from "@/hooks/useServices";
import { ServiceFormDialog } from "@/components/services/ServiceFormDialog";
import type { ServiceDTO } from "@/types/api";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/professional/services/")({
  component: ServicesList,
});

type Filter = "all" | "active" | "inactive";

interface ServiceCardProps {
  service: ServiceDTO;
  onDelete: (id: string) => void;
  onEdit: (service: ServiceDTO) => void;
  deleting: boolean;
}

function ServiceCard({ service, onDelete, onEdit, deleting }: ServiceCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-salmon-200 hover:shadow-[0_4px_16px_rgba(224,80,64,0.07)]",
        !service.is_active && "opacity-60",
      )}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl flex items-center justify-center shrink-0 bg-muted">
              <Tag className="size-4 text-chart-3" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{service.name}</p>
              <span
                className={cn(
                  "inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  service.is_active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {service.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        </div>
        {service.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
        )}
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Preço</p>
            <p className="text-sm font-bold text-chart-3">{formatPrice(service.price)}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Duração</p>
            <p className="text-sm font-bold text-foreground">
              {service.duration_minutes} min
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(service)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground border border-border hover:bg-muted transition-colors"
          >
            <Pencil className="size-3.5" />
            Editar
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={deleting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-destructive border border-border hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 className="size-3.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apagar serviço?</AlertDialogTitle>
                <AlertDialogDescription>
                  "{service.name}" será removido permanentemente. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(service.id)}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Apagar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function ServicesList() {
  const [filter, setFilter] = useState<Filter>("all");

  const [serviceDialog, setServiceDialog] = useState<{
    open: boolean;
    mode: "create" | "edit";
    service?: ServiceDTO;
  }>({ open: false, mode: "create" });

  const openCreate = () => setServiceDialog({ open: true, mode: "create", service: undefined });
  const openEdit = (service: ServiceDTO) =>
    setServiceDialog({ open: true, mode: "edit", service });

  const { data: services = [], isLoading } = useServices();
  const deleteService = useDeleteService();

  const filtered = services.filter(
    (s) => filter === "all" || (filter === "active" ? s.is_active : !s.is_active),
  );

  return (
    <main className="flex-1 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading font-bold text-foreground text-2xl tracking-tight">
            Meus Serviços
          </h2>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)] transition-all self-start"
          >
            <Plus className="size-4" />
            <span className="hidden sm:block">Novo serviço</span>
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/60">
          {(["all", "active", "inactive"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                filter === f
                  ? "bg-white text-chart-3 shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "all" ? "Todos" : f === "active" ? "Ativos" : "Inativos"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
            <Tag className="size-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground mb-1">
            {filter !== "all" ? "Nenhum serviço encontrado" : "Ainda não há serviços"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {filter !== "all"
              ? "Tente ajustar os filtros ou a busca."
              : "Crie o seu primeiro serviço para começar."}
          </p>
          {filter === "all" && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px transition-all"
            >
              <Plus className="size-4" />
              Criar primeiro serviço
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onDelete={(id) => deleteService.mutate(id)}
              onEdit={openEdit}
              deleting={deleteService.isPending}
            />
          ))}
        </div>
      )}

      <ServiceFormDialog
        key={serviceDialog.service?.id ?? "create"}
        open={serviceDialog.open}
        onOpenChange={(open) => setServiceDialog((prev) => ({ ...prev, open }))}
        mode={serviceDialog.mode}
        serviceId={serviceDialog.service?.id}
        defaultValues={
          serviceDialog.service
            ? {
                name: serviceDialog.service.name,
                description: serviceDialog.service.description ?? "",
                price: serviceDialog.service.price,
                duration_minutes: serviceDialog.service.duration_minutes,
                is_active: serviceDialog.service.is_active,
              }
            : undefined
        }
      />
    </main>
  );
}

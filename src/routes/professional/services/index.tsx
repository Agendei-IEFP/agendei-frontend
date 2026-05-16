import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Pencil, Trash2, Tag } from "lucide-react";
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
import type { CanonicalServiceDTO } from "@/types/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/professional/services/")({
  component: ServicesList,
});

type Filter = "all" | "active" | "inactive";

function formatPrice(price: string): string {
  const n = parseFloat(price);
  return n.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

interface ServiceCardProps {
  service: CanonicalServiceDTO;
  onDelete: (id: string) => void;
  deleting: boolean;
}

function ServiceCard({ service, onDelete, deleting }: ServiceCardProps) {
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
            <p className="text-sm font-bold text-chart-3">{formatPrice(service.default_price)}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Duração</p>
            <p className="text-sm font-bold text-foreground">
              {service.default_duration_minutes} min
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to="/professional/services/$id"
            params={{ id: service.id }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground border border-border hover:bg-muted transition-colors"
          >
            <Pencil className="size-3.5" />
            Editar
          </Link>

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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const { data: services = [], isLoading } = useServices();
  const deleteService = useDeleteService();

  const filtered = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "active" ? s.is_active : !s.is_active);
    return matchesSearch && matchesFilter;
  });

  const activeCount = services.filter((s) => s.is_active).length;
  const inactiveCount = services.filter((s) => !s.is_active).length;

  return (
    <main className="flex-1 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading font-bold text-foreground text-2xl tracking-tight">
            Meus Serviços
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie os serviços que você oferece
          </p>
        </div>
        <Link
          to="/professional/services/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)] transition-all self-start"
        >
          <Plus className="size-4" />
          Novo serviço
        </Link>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar serviço..."
            className="w-full rounded-lg border border-input bg-white pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
          />
        </div>
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

      {/* Stats mini */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-foreground">{services.length}</p>
          <p className="text-xs text-muted-foreground">total</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-emerald-600">{activeCount}</p>
          <p className="text-xs text-muted-foreground">ativos</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-muted-foreground">{inactiveCount}</p>
          <p className="text-xs text-muted-foreground">inativos</p>
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
            {search || filter !== "all" ? "Nenhum serviço encontrado" : "Ainda não há serviços"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {search || filter !== "all"
              ? "Tente ajustar os filtros ou a busca."
              : "Crie o seu primeiro serviço para começar."}
          </p>
          {!search && filter === "all" && (
            <Link
              to="/professional/services/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px transition-all"
            >
              <Plus className="size-4" />
              Criar primeiro serviço
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onDelete={(id) => deleteService.mutate(id)}
              deleting={deleteService.isPending}
            />
          ))}
        </div>
      )}
    </main>
  );
}

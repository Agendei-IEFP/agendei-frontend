import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminOfferings } from "@/hooks/useAdminOfferings";
import { updateOffering } from "@/lib/api/services";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/servicos/")({
  component: RouteComponent,
});

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function formatPrice(price: string): string {
  const n = parseFloat(price);
  return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2).replace(".", ",")} €`;
}

function RouteComponent() {
  const { rows, isLoading, stores } = useAdminOfferings();
  const queryClient = useQueryClient();

  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedProfId, setSelectedProfId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { mutate: toggleOffering, isPending: isToggling } = useMutation({
    mutationFn: ({
      professionalStoreId,
      offeringId,
      isEnabled,
    }: {
      professionalStoreId: string;
      offeringId: string;
      isEnabled: boolean;
    }) => updateOffering(professionalStoreId, offeringId, { is_enabled: isEnabled }),
    onSuccess: (_, { professionalStoreId }) => {
      queryClient.invalidateQueries({ queryKey: ["offerings", professionalStoreId] });
    },
  });

  function handleStoreSelect(storeId: string | null) {
    setSelectedStoreId(storeId);
    setSelectedProfId(null);
  }

  const storeFiltered = useMemo(() => {
    if (!selectedStoreId) return rows;
    return rows.filter((r) => r.store.id === selectedStoreId);
  }, [rows, selectedStoreId]);

  const availableProfessionals = useMemo(() => {
    const seen = new Set<string>();
    return storeFiltered
      .filter((r) => {
        if (seen.has(r.professional.id)) return false;
        seen.add(r.professional.id);
        return true;
      })
      .map((r) => r.professional);
  }, [storeFiltered]);

  const profFiltered = useMemo(() => {
    if (!selectedProfId) return storeFiltered;
    return storeFiltered.filter((r) => r.professional.id === selectedProfId);
  }, [storeFiltered, selectedProfId]);

  const finalRows = useMemo(() => {
    if (!search) return profFiltered;
    const q = search.toLowerCase();
    return profFiltered.filter((r) => r.offering.service.name.toLowerCase().includes(q));
  }, [profFiltered, search]);

  const totalServiceCount = stores.reduce((acc, s) => acc + s.service_count, 0);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 px-8 py-3.5 flex items-center justify-between bg-background/93 backdrop-blur-[14px] border-b border-border">
        <div>
          <h1 className="font-heading font-extrabold tracking-tight text-foreground text-lg">
            Serviços
          </h1>
          <p className="text-xs text-muted-foreground">
            {totalServiceCount} serviços em {stores.length} {stores.length === 1 ? "loja" : "lojas"}
          </p>
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Store tabs */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-border">
            <button
              onClick={() => handleStoreSelect(null)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[0.8125rem] font-semibold cursor-pointer transition-all border border-transparent",
                !selectedStoreId
                  ? "bg-chart-3 text-white shadow-[0_2px_10px_rgba(224,80,64,.25)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              Todos
            </button>
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreSelect(store.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[0.8125rem] font-semibold cursor-pointer transition-all border border-transparent",
                  selectedStoreId === store.id
                    ? "bg-chart-3 text-white shadow-[0_2px_10px_rgba(224,80,64,.25)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {store.name}
              </button>
            ))}
          </div>

          {/* Professional filter */}
          <select
            value={selectedProfId ?? ""}
            onChange={(e) => setSelectedProfId(e.target.value || null)}
            className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
          >
            <option value="">Todos os profissionais</option>
            {availableProfessionals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-input bg-white pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors w-48"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : finalRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-semibold text-foreground mb-1">
                Nenhum serviço encontrado
              </p>
              <p className="text-xs text-muted-foreground">
                {rows.length === 0
                  ? "Peça a um profissional para cadastrar serviços"
                  : "Tente ajustar os filtros"}
              </p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Serviço
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Profissional
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Loja
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Duração
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Preço
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {finalRows.map(({ offering, professional, store }) => (
                    <tr
                      key={offering.id}
                      className="border-b border-border last:border-0 hover:bg-background transition-colors"
                    >
                      {/* Service */}
                      <td className="px-5 py-3.5">
                        <p
                          className={cn(
                            "font-semibold text-foreground",
                            !offering.is_enabled && "opacity-50",
                          )}
                        >
                          {offering.service.name}
                        </p>
                        {offering.service.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {offering.service.description}
                          </p>
                        )}
                      </td>

                      {/* Professional */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-muted text-chart-4">
                            {getInitials(professional.name)}
                          </div>
                          <span className="text-xs font-medium text-foreground">
                            {professional.name}
                          </span>
                        </div>
                      </td>

                      {/* Store */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">{store.name}</td>

                      {/* Duration */}
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "text-xs text-muted-foreground",
                            !offering.is_enabled && "text-muted-foreground/50",
                          )}
                        >
                          {offering.effective_duration_minutes} min
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 text-right font-bold text-sm text-chart-3">
                        <span className={cn(!offering.is_enabled && "text-muted-foreground/50")}>
                          {formatPrice(offering.effective_price)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                            offering.is_enabled
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500",
                          )}
                        >
                          {offering.is_enabled ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <Button
                          variant={offering.is_enabled ? "destructive" : "outline"}
                          size="sm"
                          disabled={isToggling}
                          onClick={() =>
                            toggleOffering({
                              professionalStoreId: offering.professional_store_id,
                              offeringId: offering.id,
                              isEnabled: !offering.is_enabled,
                            })
                          }
                        >
                          {offering.is_enabled ? "Desativar" : "Ativar"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-5 py-3 border-t border-border bg-background">
                <p className="text-xs text-muted-foreground">
                  {finalRows.length} {finalRows.length === 1 ? "serviço" : "serviços"}
                  {finalRows.length !== rows.length && ` de ${rows.length} total`}
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

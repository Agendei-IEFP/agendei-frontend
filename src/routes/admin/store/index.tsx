import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreFormDialog } from "@/components/store/StoreFormDialog";
import { StoreCard } from "@/components/admin/StoreCard";
import { useMyStores } from "@/hooks/useStores";

export const Route = createFileRoute("/admin/store/")({
  component: RouteComponent,
});

type StatusFilter = "all" | "active" | "inactive";

function RouteComponent() {
  const { data: stores = [], isLoading } = useMyStores();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    return stores.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && s.is_active) ||
        (statusFilter === "inactive" && !s.is_active);
      return matchSearch && matchStatus;
    });
  }, [stores, search, statusFilter]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 px-8 py-3.5 flex items-center justify-between bg-background/93 backdrop-blur-[14px] border-b border-border">
        <div>
          <h1 className="font-heading font-extrabold tracking-tight text-foreground text-lg">
            Minhas Lojas
          </h1>
          <p className="text-xs text-muted-foreground">
            {stores.length} {stores.length === 1 ? "estabelecimento cadastrado" : "estabelecimentos cadastrados"}
          </p>
        </div>
        <Button
          className="bg-linear-to-br from-chart-3 to-primary text-white shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)]"
          onClick={() => setCreateOpen(true)}
        >
          <Plus />
          Nova loja
        </Button>
      </header>

      <main className="flex-1 px-8 py-8">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative max-w-xs flex-1">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar loja..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-white pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="h-36 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}

            {/* Add new store card */}
            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-2xl border-2 border-dashed border-input flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-colors hover:border-salmon-200 hover:bg-muted group min-h-[340px]"
            >
              <div className="size-12 rounded-2xl flex items-center justify-center mb-4 bg-background group-hover:bg-muted transition-colors">
                <Plus className="size-5 text-muted-foreground group-hover:text-chart-3 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Adicionar nova loja</p>
              <p className="text-xs text-muted-foreground">
                Cadastre outro estabelecimento à sua conta
              </p>
            </button>
          </div>
        )}
      </main>

      <StoreFormDialog open={createOpen} onOpenChange={setCreateOpen} mode="create" />
    </>
  );
}

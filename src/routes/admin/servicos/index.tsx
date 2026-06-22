import { createFileRoute } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useMyStores } from "@/hooks/useStores";
import { getStoreServices } from "@/lib/api/stores";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { StoreServiceDTO, StoreDTO } from "@/types/api";

export const Route = createFileRoute("/admin/servicos/")({
  component: RouteComponent,
});

type ServiceRow = StoreServiceDTO & { store_display_name: string; store_id: string };

function useAllStoreServices(stores: StoreDTO[]) {
  const results = useQueries({
    queries: stores.map((store) => ({
      queryKey: ["stores", store.id, "services"],
      queryFn: () => getStoreServices(store.id),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  const rows: ServiceRow[] = stores.flatMap((store, i) =>
    (results[i]?.data ?? []).map((s) => ({
      ...s,
      store_id: store.id,
      store_display_name: store.name,
    })),
  );

  return { rows, isLoading };
}

function RouteComponent() {
  const { data: stores = [], isLoading: storesLoading } = useMyStores();
  const { rows, isLoading: servicesLoading } = useAllStoreServices(stores);

  const isLoading = storesLoading || servicesLoading;

  return (
    <>
      
      <header className="sticky top-0 z-20 p-2 md:px-8 py-3.5 flex items-center gap-2 bg-background/93 backdrop-blur-[14px] border-b border-border">
        <SidebarTrigger className="md:hidden text-slate-500" />
        <h1 className="font-heading font-extrabold tracking-tight text-foreground text-lg">
          Serviços
        </h1>
      </header>

      <main className="flex-1 p-2 md:p-8">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-semibold text-foreground mb-1">
                Nenhum serviço encontrado
              </p>
              <p className="text-xs text-muted-foreground">
                Os serviços são adicionados pelos profissionais vinculados às suas lojas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={`${row.store_id}-${row.service_id}`}
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-background transition-colors",
                      )}
                    >
                      <td className="px-5 py-3.5 font-semibold text-foreground">
                        {row.service_name}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium text-foreground">
                        {row.professional_name}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {row.store_display_name}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {row.duration_minutes} min
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-sm text-chart-3">
                        {formatPrice(row.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

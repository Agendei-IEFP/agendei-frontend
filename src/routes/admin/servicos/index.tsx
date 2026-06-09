import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useAdminOfferings } from "@/hooks/useAdminOfferings";
import { updateOffering } from "@/lib/api/services";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/admin/servicos/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { rows, isLoading, stores } = useAdminOfferings();
  const queryClient = useQueryClient();

  const servicesExists = stores.some((store) => store.service_count);

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

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 p-2 md:px-8 py-3.5 flex items-center justify-between bg-background/93 backdrop-blur-[14px] border-b border-border">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden text-slate-500" />

          <h1 className="font-heading font-extrabold tracking-tight text-foreground text-lg">
            Serviços
          </h1>
        </div>
      </header>

      <main className="flex-1 p-2 md:p-8">
        {/* Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : servicesExists === undefined ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-semibold text-foreground mb-1">
                Nenhum serviço encontrado
              </p>
            </div>
          ) : (
            <div className="overflow-x-scroll">
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
                  {rows.map(({ offering, professional, store }) => (
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
            </div>
          )}
        </div>
      </main>
    </>
  );
}

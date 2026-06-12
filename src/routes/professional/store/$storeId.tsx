import { createFileRoute } from "@tanstack/react-router";
import { Store, Tag } from "lucide-react";
import { useServices, useUpdateService } from "@/hooks/useServices";
import { useStore } from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import type { ServiceDTO } from "@/types/api";

export const Route = createFileRoute("/professional/store/$storeId")({
  component: StoreView,
});

interface ServiceRowProps {
  service: ServiceDTO;
}

function ServiceRow({ service }: ServiceRowProps) {
  const updateService = useUpdateService();

  function toggleActive() {
    updateService.mutate({ id: service.id, body: { is_active: !service.is_active } });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all",
        service.is_active ? "border-border bg-card" : "border-border bg-muted/40 opacity-60",
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={service.is_active}
        onClick={toggleActive}
        disabled={updateService.isPending}
        className={cn(
          "relative w-10 h-5 rounded-full transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          service.is_active ? "bg-chart-3" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
            service.is_active ? "-translate-x-5.5" : "translate-x-0.5",
          )}
        />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{service.name}</p>
        {service.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{service.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
        <span className="font-semibold text-chart-3">{formatPrice(service.price)}</span>
        <span>{service.duration_minutes} min</span>
      </div>
    </div>
  );
}

function StoreView() {
  const { storeId } = Route.useParams();
  const { data: store } = useStore(storeId);
  const { data: services = [], isLoading: servicesLoading } = useServices();

  return (
    <main className="flex-1 p-2 sm:p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
          <Store className="size-5 text-chart-3" />
        </div>
        <div>
          <p className="text-xs font-semibold text-chart-3">Minha Loja</p>
          <h2 className="font-heading font-bold text-foreground text-[clamp(1.1rem,5vw,1.5rem)] tracking-tight">
            {store?.name ?? storeId}
          </h2>
        </div>
      </div>

      {/* Serviços */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="size-4 text-chart-3" />
          <h3 className="font-semibold text-foreground">Meus Serviços</h3>
          <span className="text-xs text-muted-foreground ml-1">
            — ative ou desative para os clientes
          </span>
        </div>

        {servicesLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Tag className="size-5 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">Nenhum serviço cadastrado</p>
            <p className="text-sm text-muted-foreground">
              Crie serviços em "Meus Serviços" para exibi-los aos clientes.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {services.map((service) => (
              <ServiceRow key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

import { Building2, MapPin, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { StoreDTO } from "@/types/api";

interface StoreCardProps {
  store: StoreDTO;
  className?: string;
}

export function StoreCard({ store, className }: StoreCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden flex flex-col h-full",
        "transition-all duration-200 hover:border-salmon-200 hover:shadow-[0_12px_40px_rgba(224,80,64,0.11)] hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="relative h-44 flex items-end justify-start p-4 bg-[linear-gradient(145deg,#FFE8E2,#FFAA97)]">
        {store.logo_url ? (
          <div className="size-12 rounded-2xl overflow-hidden bg-white/65 backdrop-blur-sm">
            <img src={store.logo_url} alt={store.name} className="size-full object-cover" />
          </div>
        ) : (
          <div className="size-12 rounded-2xl flex items-center justify-center bg-white/65 backdrop-blur-sm">
            <Building2 className="size-6 text-chart-4" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-foreground leading-snug mb-1">{store.name}</h3>

        {store.address && (
          <p className="text-xs flex items-center gap-1 mb-4 text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            {store.address}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{store.professional_count}</span>{" "}
            profissionais ·{" "}
            <span className="font-semibold text-foreground">{store.service_count}</span> serviços
          </span>
          <Link
            to="/stores/$storeId"
            params={{ storeId: store.id }}
            className="text-xs font-semibold flex items-center gap-0.5 text-chart-3 hover:text-chart-4 transition-colors"
          >
            Ver vitrine
            <ChevronRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

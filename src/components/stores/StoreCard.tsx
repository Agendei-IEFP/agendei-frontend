import { Building2, MapPin, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { StoreDTO } from "@/types/api";

interface StoreCardProps {
  store: StoreDTO;
  index: number;
  className?: string;
}

const BANNER_GRADIENTS = [
  "bg-[linear-gradient(145deg,#FFE8E2,#FFAA97)]",
  "bg-[linear-gradient(145deg,#EDE9FE,#C4B5FD)]",
  "bg-[linear-gradient(145deg,#D1FAE5,#6EE7B7)]",
  "bg-[linear-gradient(145deg,#FEF3C7,#FCD34D)]",
  "bg-[linear-gradient(145deg,#DBEAFE,#93C5FD)]",
  "bg-[linear-gradient(145deg,#FCE7F3,#F9A8D4)]",
  "bg-[linear-gradient(145deg,#F1F5F9,#CBD5E1)]",
  "bg-[linear-gradient(145deg,#ECFDF5,#6EE7B7)]",
] as const;

const ICON_COLORS = [
  "text-[#C03830]",
  "text-violet-700",
  "text-emerald-700",
  "text-amber-700",
  "text-blue-700",
  "text-pink-800",
  "text-slate-700",
  "text-emerald-900",
] as const;

export function StoreCard({ store, index, className }: StoreCardProps) {
  const gradient = BANNER_GRADIENTS[index % BANNER_GRADIENTS.length];
  const iconColor = ICON_COLORS[index % ICON_COLORS.length];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden flex flex-col h-full",
        "transition-all duration-200 hover:border-salmon-200 hover:shadow-[0_12px_40px_rgba(224,80,64,0.11)] hover:-translate-y-0.5",
        className,
      )}
    >
      <div className={cn("relative h-44 flex items-end justify-start p-4", gradient)}>
        {store.logo_url ? (
          <div className="size-12 rounded-2xl overflow-hidden bg-white/65 backdrop-blur-sm">
            <img src={store.logo_url} alt={store.name} className="size-full object-cover" />
          </div>
        ) : (
          <div className="size-12 rounded-2xl flex items-center justify-center bg-white/65 backdrop-blur-sm">
            <Building2 className={cn("size-6", iconColor)} strokeWidth={1.5} />
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

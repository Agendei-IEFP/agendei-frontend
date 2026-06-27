import { Building2, MapPin, Phone, Mail, Users, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StoreDTO } from "@/types/api";

interface StoreHeroProps {
  store: StoreDTO;
  className?: string;
}

export function StoreHero({ store, className }: StoreHeroProps) {
  return (
    <div className={cn("bg-card border-b border-border", className)}>
      <div className="aspect-2/1 md:aspect-4/1 w-full overflow-hidden">
        {store.banner_url ? (
          <img src={store.banner_url} alt="" className="size-full object-cover" />
        ) : (
          <div className="size-full bg-[linear-gradient(145deg,#FFE8E2,#FFAA97)]" />
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="-mt-10 mb-4 relative z-10">
          <div className="size-20 rounded-2xl border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="size-full object-cover" />
            ) : (
              <Building2 className="size-9 text-chart-4 " strokeWidth={1.5} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="font-heading font-extrabold tracking-tight text-2xl md:text-3xl text-foreground">
            {store.name}
          </h1>
        </div>

        {store.description && (
          <p className="text-sm text-muted-foreground mb-4 max-w-xl">{store.description}</p>
        )}

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground mb-6">
          {store.address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              {store.address}
            </span>
          )}
          {store.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5 shrink-0" />
              {store.phone}
            </span>
          )}
          {store.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 shrink-0" />
              {store.email}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-5 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-4 shrink-0" />
              <span>
                <span className="font-semibold text-foreground">{store.professional_count}</span>{" "}
                {store.professional_count === 1 ? "profissional" : "profissionais"}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Scissors className="size-4 shrink-0" />
              <span>
                <span className="font-semibold text-foreground">{store.service_count}</span>{" "}
                {store.service_count === 1 ? "serviço" : "serviços"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

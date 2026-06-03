import { Building2, MapPin, Phone, Mail, Users, Scissors, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/bookingStore";
import type { StoreDTO } from "@/types/api";

const STORE_TYPE_LABELS: Record<string, string> = {
  hair_salon: "Cabelo",
  barbershop: "Barbearia",
  nails: "Unhas",
  aesthetics: "Estética",
  massage: "Massagem",
  treatments: "Tratamentos",
};

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

interface StoreHeroProps {
  store: StoreDTO;
  gradientIndex?: number;
  className?: string;
}

export function StoreHero({ store, gradientIndex = 0, className }: StoreHeroProps) {
  const gradient = BANNER_GRADIENTS[gradientIndex % BANNER_GRADIENTS.length];
  const iconColor = ICON_COLORS[gradientIndex % ICON_COLORS.length];
  const openWizard = useBookingStore((s) => s.openWizard);
  return (
    <div className={cn("bg-card border-b border-border", className)}>
      {/* Banner */}
      <div className={cn("h-28 md:h-40 w-full", gradient)} />

      {/* Content below banner */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        {/* Logo floats over the banner */}
        <div className="-mt-10 mb-4">
          <div className="size-20 rounded-2xl border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="size-full object-cover" />
            ) : (
              <Building2 className={cn("size-9", iconColor)} strokeWidth={1.5} />
            )}
          </div>
        </div>

        {/* Name + type badges */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="font-heading font-extrabold tracking-tight text-2xl md:text-3xl text-foreground">
            {store.name}
          </h1>
          {store.store_types.map((type) => (
            <span
              key={type}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-salmon-100 text-chart-4"
            >
              {STORE_TYPE_LABELS[type]}
            </span>
          ))}
        </div>

        {/* Description */}
        {store.description && (
          <p className="text-sm text-muted-foreground mb-4 max-w-xl">{store.description}</p>
        )}

        {/* Meta row */}
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

        {/* Stats + CTA */}
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

          <button
            onClick={() => openWizard({ storeId: store.id })}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white",
              "bg-linear-to-br from-chart-3 to-primary",
              "shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)]",
              "transition-all duration-150",
            )}
          >
            Agendar agora
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

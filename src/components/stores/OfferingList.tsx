import { Clock, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, formatPrice } from "@/lib/format";
import type { StoreServiceDTO } from "@/types/api";

interface OfferingListProps {
  offerings: StoreServiceDTO[];
  className?: string;
}

export function OfferingList({ offerings, className }: OfferingListProps) {
  if (offerings.length === 0) return null;

  return (
    <section className={cn("max-w-4xl mx-auto px-6 py-8", className)}>
      <h2 className="font-heading font-extrabold tracking-tight text-xl text-foreground mb-4">
        Serviços
      </h2>
      <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {offerings.map((offering) => (
          <div
            key={offering.service_id}
            className="flex items-center justify-between px-5 py-4 hover:bg-muted transition-colors"
          >
            <span className="text-sm font-medium text-foreground">{offering.service_name}</span>
            <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 shrink-0" />
                {formatDuration(offering.duration_minutes)}
              </span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Banknote className="size-3.5 shrink-0" />
                {formatPrice(offering.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

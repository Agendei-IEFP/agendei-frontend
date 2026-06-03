import { cn } from "@/lib/utils";
import { ProfessionalCard } from "./ProfessionalCard";
import type { StoreProfessionalDTO } from "@/types/api";

interface StoreProfessionalListProps {
  professionals: StoreProfessionalDTO[];
  storeId: string;
  className?: string;
}

export function StoreProfessionalList({
  professionals,
  storeId,
  className,
}: StoreProfessionalListProps) {
  if (professionals.length === 0) return null;

  return (
    <section className={cn("max-w-4xl mx-auto px-6 py-8", className)}>
      <h2 className="font-heading font-extrabold tracking-tight text-xl text-foreground mb-4">
        Profissionais
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {professionals.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} storeId={storeId} />
        ))}
      </div>
    </section>
  );
}

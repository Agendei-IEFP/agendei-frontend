import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";
import type { StoreProfessionalDTO } from "@/types/api";

interface StoreProfessionalListProps {
  professionals: StoreProfessionalDTO[];
  className?: string;
}

export function StoreProfessionalList({ professionals, className }: StoreProfessionalListProps) {
  if (professionals.length === 0) return null;

  return (
    <section className={cn("max-w-4xl mx-auto px-6 py-8", className)}>
      <h2 className="font-heading font-extrabold tracking-tight text-xl text-foreground mb-4">
        Profissionais
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            {/* Avatar */}
            {professional.photo_url ? (
              <img
                src={professional.photo_url}
                alt={professional.name}
                className="size-12 rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className={cn(
                  "size-12 rounded-full flex items-center justify-center shrink-0",
                  "bg-linear-to-br from-chart-3 to-primary text-white text-sm font-bold",
                )}
              >
                {getInitials(professional.name)}
              </div>
            )}

            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{professional.name}</p>
              {professional.bio && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {professional.bio}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
